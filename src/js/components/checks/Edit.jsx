import React, {PropTypes} from 'react';
import _ from 'lodash';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Toolbar, StatusHandler} from '../global';
import CheckCreateRequest from './CheckCreateRequest';
import CheckCreateAssertions from './CheckCreateAssertions';
import CheckCreateInfo from './CheckCreateInfo';
import {Checkmark, Close, Delete} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {EnvList} from '../env';
import {Button} from '../forms';
import {Heading} from '../type';
import CheckDisabledReason from './CheckDisabledReason';
import CheckDebug from './CheckDebug';
import {validateCheck} from '../../modules';
import {
  checks as actions,
  env as envActions
} from '../../actions';
import {Check} from '../../modules/schemas';

function getState(){
  return {
    step1: {
      disabled: false
    },
    step2: {
      disabled: false
    },
    step3: {
      disabled: false
    }
  };
}

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
    return _.assign(getState(), {
      check: null,
      showEnv: false
    });
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
    if (!this.state.check && check.assertions.length && check.notifications.length){
      this.setState({
        check
      });
    }
  },
  getCheck(){
    return this.state.check || new Check().toJS();
  },
  getCheckTitle(){
    return _.get(this, 'state.check.check_spec.value.name') || 'Check';
  },
  isDisabled(){
    return !!validateCheck(this.getCheck()).length;
  },
  runRemoveCheck(){
    this.props.actions.del(this.props.params.id);
  },
  setData(data, disabled, num){
    let obj = {};
    obj[`step${num}`] = {disabled: disabled};
    obj.check = _.cloneDeep(data);
    this.setState(obj);
  },
  setShowEnv(){
    const bool = this.state.showEnv;
    this.setState({showEnv: !bool});
  },
  handleSubmit(){
    return this.props.actions.edit(this.getCheck());
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
  renderInner(){
    if (this.getCheck().id && this.getCheck().assertions.length){
      return (
        <div>
          {this.renderEnv()}
          <Padding tb={1}>
            <CheckCreateRequest check={this.getCheck()} onChange={this.setData} renderAsInclude handleTargetClick={this.setShowEnv}/>
          </Padding>
          <Padding tb={1}>
            <CheckCreateAssertions check={this.getCheck()} onChange={this.setData} renderAsInclude/>
          </Padding>
          <Padding tb={1}>
            <CheckCreateInfo check={this.getCheck()} onChange={this.setData} renderAsInclude/>
          </Padding>
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
    }else if (!this.getCheck().assertions.length){
      return <StatusHandler status="pending"/>;
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