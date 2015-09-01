import React from 'react';
import _ from 'lodash';
import {Toolbar} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {CheckStore} from '../../stores';
import {Link} from 'react-router';
import CheckStep1 from '../checks/CheckStep1.jsx';
import CheckStep2 from '../checks/CheckStep2.jsx';
import CheckStep3 from '../checks/CheckStep3.jsx';
import {Checkmark, Close} from '../icons';
import colors from 'seedling/colors';
import {Grid, Row, Col, Button} from '../../modules/bootstrap';

function getState(){
  return {
    check:CheckStore.getCheck().toJS(),
    response:CheckStore.getResponse(),
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

let checkStep1Data = {}
let checkStep2Data = {}
let checkStep3Data = {}

export default React.createClass({
  mixins: [CheckStore.mixin],
  getInitialState() {
    return getState()
  },
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  getCleanData(){
    return _.assign({}, checkStep1Data, checkStep2Data, checkStep3Data);
  },
  updateCheckStep1Data(data, disabled){
    checkStep1Data = data;
    this.setState({step1:{disabled:disabled}});
  },
  updateCheckStep2Data(data, disabled){
    checkStep2Data = data;
    this.setState({step1:{disabled:disabled}});
  },
  updateCheckStep3Data(data, disabled){
    checkStep3Data = data;
    this.setState({step1:{disabled:disabled}});
  },
  disabled(){
    return this.state.step1.disabled || this.state.step2.disabled || this.state.step3.disabled;
  },
  submit(){
    console.log(this.getCleanData());
  },
  render() {
    return (
      <div className="bg-body" style={{position:"relative"}}>
        <Toolbar btnPosition="midRight" title={`Edit ${this.state.check.name || this.state.check.id}`}>
          <Link to="check" params={{id:this.state.check.id}} className="btn btn-icon btn-flat" title="Return to Check">
            <Close btn={true}/>
          </Link>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <div className="padding-tb">
                <CheckStep1 {...this.state} onChange={this.updateCheckStep1Data} renderAsInclude={true}/>
              </div>
              <div className="padding-tb">
                <CheckStep2 {...this.state} onChange={this.updateCheckStep2Data} renderAsInclude={true}/>
              </div>
              <div className="padding-tb">
                <CheckStep3 {...this.state} onChange={this.updateCheckStep3Data} renderAsInclude={true}/>
              </div>
              {
                // <pre>{this.getCleanData() && JSON.stringify(this.getCleanData(), null, ' ')}</pre>
              }
              <div><br/></div>
              <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()}>
                <span>Finish
                  <Checkmark inline={true} fill={colors.success}/>
                </span>
            </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});