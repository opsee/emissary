import React, {PropTypes} from 'react';
import _ from 'lodash';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Toolbar, StatusHandler} from '../global';
import CheckCreateRequest from './CheckCreateRequest';
import AssertionsHTTP from './AssertionsHTTP';
import AssertionsCloudwatch from './AssertionsCloudwatch';
import CheckCreateInfo from './CheckCreateInfo';
import {Checkmark, Close, Delete} from '../icons';
import {Col, Grid, Padding, Row} from '../layout';
import {EnvList} from '../env';
import {Button} from '../forms';
import {Heading} from '../type';
import CheckDisabledReason from './CheckDisabledReason';
import CheckDebug from './CheckDebug';
import {validate} from '../../modules';
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
      edit: PropTypes.func,
      testCheckReset: PropTypes.func
    }),
    envActions: PropTypes.shape({
      getGroupsSecurity: PropTypes.func,
      getGroupsElb: PropTypes.func,
      getInstancesEcc: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object
      }),
      asyncActions: PropTypes.shape({
        checkEdit: PropTypes.object,
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
  componentWillReceiveProps(nextProps) {
    const data = nextProps.redux.checks.checks.find(g => {
      return g.get('id') === this.props.params.id;
    }) || new Check();
    const check = data.toJS();
    if (!this.state.check && check.COMPLETE){
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
  renderLink(){
    return this.getCheck().id ?
    (
      <Button to={`/check/${this.getCheck().id}`} icon flat title="Return to Check">
        <Close btn/>
      </Button>
    )
     : <div/>;
  },
  renderRequest(){
    if (!_.get(this.getCheck(), 'target.type').match('dbinstance|rds')){
      return (
        <Padding tb={1}>
          <CheckCreateRequest check={this.getCheck()} onChange={this.setData} renderAsInclude handleTargetClick={this.setShowEnv}/>
        </Padding>
      );
    }
    return null;
  },
  renderAssertions(){
    if (_.get(this.getCheck(), 'target.type').match('dbinstance|rds')){
      return <AssertionsCloudwatch check={this.getCheck()} onChange={this.setData} renderAsInclude/>;
    }
    return <AssertionsHTTP check={this.getCheck()} onChange={this.setData} renderAsInclude/>;
  },
  renderInner(){
    if (this.getCheck().id && this.getCheck().COMPLETE){
      return (
        <div>
          {this.renderEnv()}
          {this.renderRequest()}
          <Padding tb={1}>
            {this.renderAssertions()}
          </Padding>
          <CheckCreateInfo check={this.getCheck()} onChange={this.setData} renderAsInclude/>
          <Padding t={1}>
          <StatusHandler status={this.props.redux.asyncActions.checkEdit.status}/>
          <Button color="success" block type="submit" onClick={this.handleSubmit} disabled={this.isDisabled()}>
            Finish <Checkmark inline fill={seed.color.success}/>
          </Button>
          <CheckDisabledReason check={this.getCheck()}/>
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
    return (
      <div>
        <Toolbar btnPosition="midRight" title={`Edit ${this.getCheckTitle()}`} bg="info">
          {this.renderLink()}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
              <CheckDebug check={_.omit(this.getCheck(), 'results')}/>
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