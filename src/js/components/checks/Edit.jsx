import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Toolbar, StatusHandler} from '../global';
import CheckCreateRequest from './CheckCreateRequest';
import AssertionsHTTP from './AssertionsHTTP';
import AssertionsCloudwatch from './AssertionsCloudwatch';
import CheckCreateInfo from './CheckCreateInfo';
import {Checkmark, Close, Delete} from '../icons';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {EnvList} from '../env';
import {Button} from '../forms';
import {Heading} from '../type';
import CheckDisabledReason from './CheckDisabledReason';
import CheckDebug from './CheckDebug';
import {getCheckTypes, validate} from '../../modules';
import {
  checks as actions,
  env as envActions
} from '../../actions';
import {Check} from '../../modules/schemas';

const CheckEdit = React.createClass({
  propTypes: {
    params: PropTypes.object,
    onFilterChange: PropTypes.func,
    filter: PropTypes.string,
    actions: PropTypes.shape({
      getCheck: PropTypes.func,
      del: PropTypes.func,
      testCheckReset: PropTypes.func,
      createOrEdit: PropTypes.func
    }),
    envActions: PropTypes.shape({
      getGroupsSecurity: PropTypes.func,
      getGroupsElb: PropTypes.func,
      getInstancesEcc: PropTypes.func
    }),
    history: PropTypes.object.isRequired,
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object,
        single: PropTypes.object
      }),
      asyncActions: PropTypes.shape({
        checkCreateOrEdit: PropTypes.object,
        getCheck: PropTypes.object
      })
    })
  },
  getInitialState() {
    return {
      check: null,
      showEnv: false
    };
  },
  componentWillMount(){
    this.props.actions.getCheck(this.props.params.id);
    this.props.envActions.getGroupsSecurity();
    this.props.envActions.getGroupsElb();
    this.props.envActions.getInstancesEcc();
    this.props.actions.testCheckReset();
  },
  componentWillReceiveProps() {
    let el = null;
    const {single} = this.props.redux.checks;
    if (single.get('id') === this.props.params.id){
      el = single;
    }
    const data = el || new Check();
    const check = data.toJS();
    if (!this.state.check && _.find(check.tags, () => 'complete')){
      this.setState({
        check
      });
    }
  },
  getCheck(){
    return this.state.check || new Check().toJS();
  },
  getCheckTitle(){
    return _.get(this, 'state.check.name') || 'Check';
  },
  isDisabled(){
    return !!validate.check(this.getCheck()).length;
  },
  runRemoveCheck(){
    this.props.actions.del([this.props.params.id]);
  },
  setData(data){
    this.setState({
      check: _.cloneDeep(data)
    });
  },
  setShowEnv(){
    const bool = this.state.showEnv;
    this.setState({showEnv: !bool});
  },
  handleSubmit(){
    return this.props.actions.createOrEdit(this.getCheck());
  },
  handleTargetSelect(target){
    let check = _.cloneDeep(this.getCheck());
    check.target = _.pick(target, ['id', 'name', 'type']);
    this.setData(check);
    this.setShowEnv();
  },
  renderEnv(){
    if (this.state.showEnv){
      return (
        <Padding tb={1}>
          <EnvList onTargetSelect={this.handleTargetSelect} include={['groups.elb', 'groups.security', 'instances.ecc']} filter={this.props.filter} onFilterChange={this.props.onFilterChange}/>
        </Padding>
      );
    }
    return null;
  },
  renderLink(check){
    return check.id ?
    (
      <Button to={`/check/${check.id}`} icon flat title="Return to Check">
        <Close btn/>
      </Button>
    )
     : <div/>;
  },
  renderRequest(check){
    if (check.type === 'http'){
      return (
        <Padding tb={1}>
          <CheckCreateRequest check={check} onChange={this.setData} renderAsInclude handleTargetClick={this.setShowEnv} types={getCheckTypes(this.props.redux)}/>
        </Padding>
      );
    }
    return null;
  },
  renderAssertions(check){
    if (check.type === 'cloudwatch'){
      return <AssertionsCloudwatch check={check} onChange={this.setData} renderAsInclude history={this.props.history} types={getCheckTypes(this.props.redux)}/>;
    }
    return <AssertionsHTTP check={check} onChange={this.setData} renderAsInclude history={this.props.history} types={getCheckTypes(this.props.redux)}/>;
  },
  renderInner(check){
    if (check.id && _.find(check.tags, () => 'complete')) {
      return (
        <div>
          {this.renderEnv()}
          {this.renderRequest(check)}
          <Padding tb={1}>
            {this.renderAssertions(check)}
          </Padding>
          <CheckCreateInfo check={check} onChange={this.setData} renderAsInclude types={getCheckTypes(this.props.redux)}/>
          <Padding t={1}>
          <StatusHandler status={this.props.redux.asyncActions.checkCreateOrEdit.status}/>
          <Button color="success" block type="submit" onClick={this.handleSubmit} disabled={this.isDisabled()}>
            {this.props.redux.asyncActions.checkCreateOrEdit.status === 'pending' ? 'Saving...' : 'Finish'} <Checkmark inline fill="white"/>
          </Button>
          <CheckDisabledReason check={check}/>
          </Padding>
          <Padding t={4}>
            <Padding t={4}>
              <Button onClick={this.runRemoveCheck} flat color="danger">
                <Delete inline fill="danger"/> Delete Check
              </Button>
            </Padding>
          </Padding>
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getCheck.status}>
        <Heading level={2}>Check not found.</Heading>
      </StatusHandler>
    );
  },
  render() {
    const check = this.getCheck();
    return (
      <div>
        <Toolbar btnPosition="midRight" title={`Edit ${this.getCheckTitle()}`} bg="info">
          {this.renderLink(check)}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding t={1}>
                <Panel>
                  {this.renderInner(check)}
                </Panel>
              </Padding>
              <CheckDebug check={_.omit(check, 'results')}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  envActions: bindActionCreators(envActions, dispatch)
});

export default connect(null, mapDispatchToProps)(CheckEdit);