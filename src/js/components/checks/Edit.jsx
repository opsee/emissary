import React from 'react';
import _ from 'lodash';
import {Toolbar, StatusHandler} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {CheckStore} from '../../stores';
import {Link} from 'react-router';
import CheckCreateRequest from '../checks/CheckCreateRequest.jsx';
import CheckCreateAssertions from '../checks/CheckCreateAssertions.jsx';
import CheckCreateInfo from '../checks/CheckCreateInfo.jsx';
import {Checkmark, Close} from '../icons';
import colors from 'seedling/colors';
import {CheckActions, GlobalActions} from '../../actions';
import {Grid, Row, Col, Button} from '../../modules/bootstrap';
import {PageAuth} from '../../modules/statics';
import router from '../../modules/router';
import {Padding} from '../layout';

function getState(){
  return {
    status:CheckStore.getGetCheckStatus(),
    check:CheckStore.getCheck().toJS(),
    response:CheckStore.getResponse(),
    editStatus:CheckStore.getCheckEditStatus(),
    step1:{
      disabled:false
    },
    step2:{
      disabled:false
    },
    step3:{
      disabled:false
    }
  }
}

const CheckEdit = React.createClass({
  mixins: [CheckStore.mixin],
  storeDidChange(){
    const state = getState();
    if(state.editStatus == 'success'){
      router.transitionTo('checks');
    }else if(state.editStatus && state.editStatus != 'pending'){
      GlobalActions.globalModalMessage({
        html:status.body && status.body.message || 'Something went wrong.',
        style:'danger'
      });
    }
    this.setState(state);
  },
  statics:{
    willTransitionTo:PageAuth
  },
  getInitialState() {
    return getState()
  },
  getDefaultProps() {
    return getState();
  },
  getFinalData(){
    return this.state.check;
  },
  updateData(data, disabled, num){
    var obj = {};
    obj[`step${num}`] = {disabled:disabled};
    obj.check = data;
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
  renderLink(){
    return this.state.check.id ?
    (
      <Link to="check" params={{id:this.state.check.id}} className="btn btn-icon btn-flat" title="Return to Check">
        <Close btn={true}/>
      </Link>
    )
     : <div/>;
  },
  render() {
    if(this.state.check.id){
      return (
        <div>
          <Toolbar btnPosition="midRight" title={`Edit ${this.getCheckTitle()}`} bg="info">
            {this.renderLink()}
          </Toolbar>
          <Grid>
            <Row>
              <Col xs={12}>
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
                <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()}>
                  Finish <Checkmark inline={true} fill={colors.success}/>
                </Button>
                </Padding>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }else{
      return (
        <StatusHandler status={this.state.status}>
          <h2>Check not found.</h2>
        </StatusHandler>
      )
    }
  }
});

export default CheckEdit;