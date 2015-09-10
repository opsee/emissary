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
import {CheckActions} from '../../actions';
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

let stepData = {
  step1:{},
  step2:{},
  step3:{}
}

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
    return _.assign({}, stepData.step1, stepData.step2, stepData.step3);
  },
  updateData(data, disabled, num){
    // this.setState({check:_.extend(this.state.check,data)});
    var obj = {};
    obj[`step${num}`] = {disabled:disabled};
    stepData[`step${num}`] = data;
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
    console.log(this.getCleanData());
  },
  renderLink(){
    return this.state.check.id ? 
    (
      <Link to="check" params={{id:this.state.check.id}} className="btn btn-primary btn-fab" title="Return to Check">
        <Close btn={true}/>
      </Link>
    )
     : <div/>;
  },
  render() {
    if(this.state.check.id){
      return (
        <div>
          <Toolbar btnPosition="midRight" title={`Edit ${this.state.check.name || this.state.check.id}`}>
            {this.renderLink()}
          </Toolbar>
          <Grid>
            <Row>
              <Col xs={12} sm={10} smOffset={1}>
                <div className="padding-tb">
                  <CheckStep1 {...this.state} onChange={this.updateData} renderAsInclude={true}/>
                </div>
                <div className="padding-tb">
                  <CheckStep2 {...this.state} onChange={this.updateData} renderAsInclude={true}/>
                </div>
                <div className="padding-tb">
                  <CheckStep3 {...this.state} onChange={this.updateData} renderAsInclude={true}/>
                </div>
                {
                  <pre>{this.getCleanData() && JSON.stringify(this.getCleanData(), null, ' ')}</pre>
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
    }else{
      return <div/>
    }
  }
});