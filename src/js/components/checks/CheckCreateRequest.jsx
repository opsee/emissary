import React, {PropTypes} from 'react';
import _ from 'lodash';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Button} from '../forms';
import {BastionRequirement, Toolbar} from '../global';
import {Add, Close, Delete} from '../icons';
import {UserDataRequirement} from '../user';
import CheckResponsePaginate from './CheckResponsePaginate.jsx';
import CheckDisabledReason from './CheckDisabledReason.jsx';
import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {validate} from '../../modules';
import {Input, RadioSelect} from '../forms';
import {
  checks as checkActions,
  user as userActions
} from '../../actions';

const CheckCreateRequest = React.createClass({
  propTypes: {
    check: PropTypes.object,
    renderAsInclude: PropTypes.bool,
    onChange: PropTypes.func,
    onTargetClick: PropTypes.func,
    checkActions: PropTypes.shape({
      testCheckReset: PropTypes.func
    }),
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    //allows user to edit target in /check/edit mode
    handleTargetClick: PropTypes.func,
    history: PropTypes.object,
    redux: PropTypes.shape({
      env: PropTypes.shape({
        instances: PropTypes.object,
        groups: PropTypes.object
      })
    })
  },
  componentWillMount(){
    if (!this.props.check.target.id && !this.isURLCheck()){
      return this.props.history.push('/check-create/target');
    }
    return this.props.checkActions.testCheckReset();
  },
  getInitialState() {
    return {
      url: this.getUrl(),
      hasSetPort: this.props.renderAsInclude,
      debouncedRunUrlChange: _.debounce(this.runUrlChange, 800)
    };
  },
  getHeaders(fromSource){
    const arr = _.cloneDeep(_.get(this.props, 'check.spec.headers')) || [];
    if (fromSource){
      return arr;
    }
    return arr.map(h => {
      if (Array.isArray(h.values)){
        return _.assign(h, {
          values: h.values.join(', ')
        });
      }
      return h;
    });
  },
  getUrl(){
    const {check} = this.props;
    const spec = check.spec;
    if (this.isURLCheck() && check.target.id && spec.path){
      let port = '';
      if (spec.protocol === 'http' && spec.port !== 80){
        port = `:${spec.port}`;
      } else if (spec.protocol === 'https' && spec.port !== 443){
        port = `:${spec.port}`;
      }
      return `${spec.protocol}://${check.target.id}${port}${spec.path}`;
    }
    return undefined;
  },
  getCheck(){
    return _.cloneDeep(this.props.check);
  },
  isDisabled(){
    return !!validate.check(this.props.check, ['request']).length;
  },
  isURLCheck(){
    const targetType = this.props.check.target.type;
    return targetType === 'host' || targetType === 'external_host';
  },
  runChange(data){
    let check = data;
    const spec = check.spec;
    //lets see if a user has "touched" the port
    //if not, lets give them some nice defaults
    let hasSetPort = this.state.hasSetPort;
    if (this.props.check.spec.port !== spec.port){
      hasSetPort = true;
      this.setState({
        hasSetPort
      });
    }
    if (!hasSetPort){
      if (spec.protocol === 'http'){
        spec.port = 80;
      } else if (spec.protocol === 'https'){
        spec.port = 443;
      }
    }
    if (spec.port){
      check.spec.port = parseInt(spec.port, 10);
    }
    if (spec.path && !spec.path.match('^\/')){
      check.spec.path = `/${spec.path}`;
    }
    if (spec.verb === 'GET'){
      check.spec = _.omit(spec, ['body']);
    }
    return this.props.onChange(check);
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckRequestHelp');
  },
  runAddHeader(){
    let check = _.cloneDeep(this.props.check);
    check.spec.headers.push({
      name: undefined,
      values: []
    });
    this.runChange(check);
  },
  runRemoveHeader(index){
    let check = _.cloneDeep(this.props.check);
    check.spec.headers.splice(index, 1);
    this.runChange(check);
  },
  runUrlChange(state){
    const check = _.cloneDeep(this.props.check);
    const spec = check.spec;
    let string = _.clone(state.url);
    if (!string.match('^http|^ws')){
      string = `http://${string}`;
    }
    try {
      const url = new window.URL(string);
      check.spec = _.assign(spec, {
        port: parseInt(url.port, 10) || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname || '/',
        protocol: (url.protocol || '').replace(':', '')
      });
      check.target.id = url.hostname;
    } catch (err) {
      check.spec = _.pick(spec, ['verb', 'body', 'name']);
    }
    this.runChange(check);
  },
  handleSubmit(e){
    e.preventDefault();
    if (!this.props.renderAsInclude){
      const data = JSON.stringify(this.props.check);
      this.props.history.push(`/check-create/assertions?data=${data}`);
    }
  },
  handleTargetClick(){
    if (!this.props.renderAsInclude){
      this.props.history.push('/check-create/target');
    } else if (typeof this.props.handleTargetClick === 'function'){
      this.props.handleTargetClick();
    }
  },
  handleHeaderChange(index, data){
    const headers = this.getHeaders(true).map((h, i) => {
      if (index === i){
        return _.assign(data, {
          values: data.values.split(', ')
        });
      }
      return h;
    });
    let check = _.cloneDeep(this.props.check);
    check.spec.headers = headers;
    this.runChange(check);
  },
  handleUrlChange(state){
    this.setState(state);
    this.state.debouncedRunUrlChange(state);
  },
  renderHeaderForm(){
    return (
      <div>
        <Heading level={3}>Request Headers</Heading>
        {this.getHeaders().map((header, index) => {
          return (
            <Padding b={2} key={`header-${index}`}>
              <Grid fluid>
                <Row>
                  <Col xs={12} sm={5} key={`header-field-${index}-key`}>
                    <Padding b={1}>
                      <Input data={header} path="name" onChange={this.handleHeaderChange.bind(null, index)} placeholder="content-type" label="Key*"/>
                    </Padding>
                  </Col>
                  <Col xs={10} sm={5} key={`header-field-${index}-value`}>
                    <Padding b={1}>
                      <Input data={header} path="values" onChange={this.handleHeaderChange.bind(null, index)} placeholder="application/json" label="Value*"/>
                    </Padding>
                  </Col>
                  <Col xs={2}>
                    <Padding t={3}>
                      <Padding t={0.5}>
                        <Button flat color="danger" className="pull-right" title="Remove this Header" onClick={this.runRemoveHeader.bind(null, index)}>
                          <Delete inline fill="danger"/>
                        </Button>
                      </Padding>
                    </Padding>
                  </Col>
                </Row>
              </Grid>
            </Padding>
          );
        })
        }
        <Button flat color="primary" onClick={this.runAddHeader}>
          <Add fill={seed.color.primary} inline/> Add {!this.getHeaders().length ? 'A' : 'Another'} Header
        </Button>
      </div>
    );
  },
  renderLink(){
    return this.state.check.id ? (
      <Button color="primary" fab to={`/check/${this.state.check.id}`} title="Edit {check.name}"/>
      ) : <div/>;
  },
  renderTargetSelection(){
    const {target} = this.props.check;
    let {type} = target;
    if (!type || this.isURLCheck()){
      return null;
    }
    type = type === 'dbinstance' ? 'rds' : type;
    type = type === 'sg' ? 'security' : type;
    if (type && target.id){
      let inner = null;
      if (type.match('^ecc$|^instance$|^rds$')){
        inner = <InstanceItem noBorder linkInsteadOfMenu onClick={this.handleTargetClick} title="Return to target selection" target={target}/>;
      } else {
        inner = <GroupItem noBorder linkInsteadOfMenu onClick={this.handleTargetClick} title="Return to target selection" target={target}/>;
      }
      return (
        <Padding b={3}>
          <Heading level={3}>Your Target</Heading>
          {inner}
        </Padding>
      );
    }
    return null;
  },
  renderHelperText(){
    if (this.props.renderAsInclude){
      return null;
    }
    let text = (
      <div>Next, specify the parameters of your request. A typical request might be a GET at route '/' on port 80.</div>
    );
    if (this.isURLCheck()){
      text = (
        <div>Next, enter a URL. This can be an internal or public-facing service.</div>
      );
    }
    return (
        <UserDataRequirement hideIf="hasDismissedCheckRequestHelp">
          <Alert color="success" onDismiss={this.runDismissHelperText}>
            {text}
          </Alert>
        </UserDataRequirement>
      );
  },
  renderBodyInput(){
    if (this.props.check.spec.verb !== 'GET'){
      return (
        <Padding b={1}>
          <Input data={this.props.check} path="spec.body" onChange={this.runChange} label="Body" textarea/>
        </Padding>
      );
    }
    return null;
  },
  renderVerbInput(){
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(id => {
      return {id};
    });
    return (
      <Padding b={1}>
        <RadioSelect inline options={methods} path="spec.verb" data={this.props.check} onChange={this.runChange} label="Method*"/>
      </Padding>
    );
  },
  renderUrlInputs(){
    return (
      <Padding b={1}>
        <Heading level={3}>Define Your HTTP Request</Heading>
        {this.renderVerbInput()}
        <Padding b={1}>
          <Input data={this.state} path="url" onChange={this.handleUrlChange} label="URL*" placeholder="https://try.opsee.com or http://192.168.1.1:80"/>
        </Padding>
        {this.renderBodyInput()}
      </Padding>
    );
  },
  renderHttpInputs(){
    const protocols = ['http', 'https', 'ws', 'wss'].map(id => {
      return {id};
    });
    return (
      <Padding b={1}>
        <Heading level={3}>Define Your HTTP Request</Heading>
        <Padding b={1}>
          <RadioSelect inline options={protocols} path="spec.protocol" data={this.props.check} onChange={this.runChange} label="Protocol*"/>
        </Padding>
        {this.renderVerbInput()}
        <Padding b={1}>
          <Input data={this.props.check} path="spec.path" onChange={this.runChange} label="Path*" placeholder="/healthcheck"/>
        </Padding>
        <Padding b={1}>
          <Input data={this.props.check} path="spec.port" onChange={this.runChange} label="Port*" placeholder="e.g. 8080"/>
        </Padding>
        {this.renderBodyInput()}
      </Padding>
    );
  },
  renderInputs(){
    if (this.isURLCheck()){
      return this.renderUrlInputs();
    }
    return this.renderHttpInputs();
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <Padding tb={1}/>
          <Button color="success" block type="submit" disabled={this.isDisabled()} title="Define Assertions" chevron>Next: Define Assertions</Button>
          <CheckDisabledReason check={this.getCheck()} areas={['request']}/>
        </div>
      );
    }
    return null;
  },
  renderInner(){
    return (
      <form name="checkCreateRequestForm" ref="form" onSubmit={this.handleSubmit}>
        <Padding b={2}>
          {this.renderHelperText()}
        </Padding>
        {this.renderTargetSelection()}
        <Padding b={1}>
          {this.renderInputs()}
          {this.renderHeaderForm()}
        </Padding>
        <hr/>
        <Padding b={1}>
          <CheckResponsePaginate check={this.getCheck()} showBoolArea={false}/>
        </Padding>
        <Padding b={1}>
          {this.renderSubmitButton()}
        </Padding>
      </form>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (3 of 5)" bg="info">
          <Button to="/" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement>
                {this.renderInner()}
              </BastionRequirement>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
  render() {
    return this.props.renderAsInclude ? this.renderInner() : this.renderAsPage();
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  checkActions: bindActionCreators(checkActions, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckCreateRequest);