import React, {PropTypes} from 'react';
import _ from 'lodash';
import colors from 'seedling/colors';
import {History} from 'react-router';

import {Toolbar, StatusHandler} from '../global';
import {CheckStore} from '../../stores';
import CheckCreateRequest from '../checks/CheckCreateRequest.jsx';
import CheckCreateAssertions from '../checks/CheckCreateAssertions.jsx';
import CheckCreateInfo from '../checks/CheckCreateInfo.jsx';
import {Checkmark, Close, Delete} from '../icons';
import {CheckActions, GlobalActions} from '../../actions';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {EnvWithFilter} from '../env';
import {Button} from '../forms';

function getState(){
  return {
    status: CheckStore.getGetCheckStatus(),
    response: CheckStore.getResponse(),
    editStatus: CheckStore.getCheckEditStatus(),
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
  mixins: [CheckStore.mixin, History],
  propTypes: {
    params: PropTypes.object,
    onFilterChange: PropTypes.func,
    filter: PropTypes.string
  },
  getInitialState() {
    return _.assign(getState(), {
      check: CheckStore.newCheck(),
      showEnv: false
    });
  },
  getDefaultProps() {
    return getState();
  },
  componentWillMount(){
    this.getData();
  },
  storeDidChange(){
    let state = getState();
    if (state.editStatus === 'success'){
      this.history.pushState(null, '/');
    }else if (state.editStatus && state.editStatus !== 'pending'){
      GlobalActions.globalModalMessage({
        html: status.body && status.body.message || 'Something went wrong.',
        style: 'danger'
      });
    }
    if (state.status === 'success'){
      state.check = CheckStore.getCheck().toJS();
    }
    if (CheckStore.getDeleteCheckStatus() === 'success'){
      this.history.pushState(null, '/');
    }
    this.setState(state);
  },
  getFinalData(){
    return this.state.check;
  },
  getData(){
    CheckActions.getCheck(this.props.params.id);
  },
  getCheckTitle(){
    return _.get(this, 'state.check.check_spec.value.name') || 'Check';
  },
  isDisabled(){
    return this.state.step1.disabled || this.state.step2.disabled || this.state.step3.disabled;
  },
  runRemoveCheck(){
    CheckActions.deleteCheck(this.props.params.id);
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
    CheckActions.checkEdit(this.getFinalData());
  },
  handleTargetSelect(id, type){
    let check = _.cloneDeep(this.state.check);
    check.target.id = id;
    check.target.type = type || 'sg';
    this.setData(check);
    this.setShowEnv();
  },
  renderEnv(){
    if (this.state.showEnv){
      return (
        <Padding tb={1}>
          <EnvWithFilter onTargetSelect={this.handleTargetSelect} include={['groupsSecurity', 'groupsELB']} filter={this.props.filter} onFilterChange={this.props.onFilterChange}/>
        </Padding>
      );
    }
    return <div/>;
  },
  renderLink(){
    return this.state.check.id ?
    (
      <Button to={`/check/${this.state.check.id}`} icon flat title="Return to Check">
        <Close btn/>
      </Button>
    )
     : <div/>;
  },
  renderInner(){
    if (this.state.check.id){
      return (
        <div>
          {this.renderEnv()}
          <Padding tb={1}>
            <CheckCreateRequest {...this.state} onChange={this.setData} renderAsInclude/>
          </Padding>
          <Padding tb={1}>
            <CheckCreateAssertions {...this.state} onChange={this.setData} renderAsInclude/>
          </Padding>
          <Padding tb={1}>
            <CheckCreateInfo {...this.state} onChange={this.setData} renderAsInclude/>
          </Padding>
          <Padding t={1}>
          <Button color="success" block type="submit" onClick={this.handleSubmit} disabled={this.isDisabled()}>
            Finish <Checkmark inline fill={colors.success}/>
          </Button>
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
      <StatusHandler status={this.state.status}>
        <h2>Check not found.</h2>
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
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default CheckEdit;