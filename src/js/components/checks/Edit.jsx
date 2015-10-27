import React from 'react';
import _ from 'lodash';
import scrollTo from 'animated-scrollto';
import offset from 'document-offset';
import {Link} from 'react-router';
import colors from 'seedling/colors';

import {Toolbar, StatusHandler} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {CheckStore} from '../../stores';
import CheckCreateRequest from '../checks/CheckCreateRequest.jsx';
import CheckCreateAssertions from '../checks/CheckCreateAssertions.jsx';
import CheckCreateInfo from '../checks/CheckCreateInfo.jsx';
import {Checkmark, Close} from '../icons';
import {CheckActions, GlobalActions} from '../../actions';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {PageAuth} from '../../modules/statics';
import router from '../../modules/router';
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
  }
}

const CheckEdit = React.createClass({
  mixins: [CheckStore.mixin],
  storeDidChange(){
    let state = getState();
    if (state.editStatus == 'success'){
      router.transitionTo('checks');
    }else if (state.editStatus && state.editStatus != 'pending'){
      GlobalActions.globalModalMessage({
        html: status.body && status.body.message || 'Something went wrong.',
        style: 'danger'
      });
    }
    if (state.status == 'success'){
      state.check = CheckStore.getCheck().toJS();
    }
    this.setState(state);
  },
  statics: {
    willTransitionTo: PageAuth
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
  getFinalData(){
    return this.state.check;
  },
  updateData(data, disabled, num){
    var obj = {};
    obj[`step${num}`] = {disabled: disabled};
    obj.check = _.cloneDeep(data);
    this.setState(obj);
  },
  disabled(){
    return this.state.step1.disabled || this.state.step2.disabled || this.state.step3.disabled;
  },
  getData(){
    CheckActions.getCheck(this.props.params.id);
  },
  componentWillMount(){
    this.getData();
  },
  submit(){
    CheckActions.checkEdit(this.getFinalData());
  },
  getCheckTitle(){
    return this.state.check.check_spec.value.name || this.state.check.id;
  },
  handleTargetSelect(id, type){
    let check = _.cloneDeep(this.state.check);
    check.target.id = id;
    check.target.type = type || 'sg';
    this.updateData(check);
    this.toggleEnv();
  },
  toggleEnv(){
    const bool = this.state.showEnv;
    this.setState({showEnv:!bool});
    if (!bool){
      // setTimeout(function(){
      //   scrollTo(document.body, 0, 0);
      // }, 50);
    }else {
      // setTimeout(function(){
      //   scrollTo(document.body, 0, 0);
      // }, 50);
    }
  },
  renderEnv(){
    if (this.state.showEnv){
      return (
        <Padding tb={1}>
          <EnvWithFilter onTargetSelect={this.handleTargetSelect} include={['groupsSecurity', 'groupsELB']} filter={this.props.filter} onFilterChange={this.props.onFilterChange}/>
        </Padding>
      )
    }else {
      return <div/>
    }
  },
  renderLink(){
    return this.state.check.id ?
    (
      <Button to="check" params={{id: this.state.check.id}} icon={true} flat={true} title="Return to Check">
        <Close btn={true}/>
      </Button>
    )
     : <div/>;
  },
  render() {
    if (this.state.check.id){
      return (
        <div>
          <Toolbar btnPosition="midRight" title={`Edit ${this.getCheckTitle()}`} bg="info">
            {this.renderLink()}
          </Toolbar>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.renderEnv()}
                <Padding tb={1}>
                  <CheckCreateRequest {...this.state} onChange={this.updateData} renderAsInclude={true}/>
                </Padding>
                <Padding tb={1}>
                  <CheckCreateAssertions {...this.state} onChange={this.updateData} renderAsInclude={true}/>
                </Padding>
                <Padding tb={1}>
                  <CheckCreateInfo {...this.state} onChange={this.updateData} renderAsInclude={true}/>
                </Padding>
                <Padding t={1}>
                <Button color="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()}>
                  Finish <Checkmark inline={true} fill={colors.success}/>
                </Button>
                </Padding>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }else {
      return (
        <StatusHandler status={this.state.status}>
          <h2>Check not found.</h2>
        </StatusHandler>
      )
    }
  }
});

export default CheckEdit;