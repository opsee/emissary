import React from 'react';
import _ from 'lodash';
import slate from 'slate';
import {Close, Checkmark} from '../icons';
import colors from 'seedling/colors';
import Radium from 'radium';

let assertionIconStyle = {
  height:'12px',
  margin:'-6px 0 0 -6px',
  position:'absolute',
  top:'50%',
  left:'50%',
  width:'12px',
}

const AssertionCounter = React.createClass({
  getInitialState(){
    return this.props;
  },
  getField(fieldName){
    const field = _.find(this.state.fields, field => field.name == fieldName);
    if(field){
      return field.value();
    }else{
      return false;
    }
  },
  setAssertionPassing(){
    /* 
      this.state.fields should be an array of BoundFields
    */
    let obj = {
      key:this.getField('type'),
      relationship:this.getField('relationship'),
      operand:this.getField('operand'),
      value:this.getField('value')
    }
    var test = slate.testAssertion({
      assertion:obj,
      response:this.state.response
    })
    this.setState({
      passing:test && test.success,
      error:!test || test.error
    });
  },
  componentWillReceiveProps(){
    this.setAssertionPassing();
  },
  hasRelationship(){
    return _.find(this.state.fields, field => field.name == 'relationship').value()
  },
  isActive(){
    return this.hasRelationship() ? 'active' : '';
  },
  getTitle(){
    return this.state.passing ? 'Assertion is currently passing.' : 'Assertion is currently failing.'
  },
  getSmallIcon(){
    return this.state.passing ? (
      <Checkmark style={assertionIconStyle} fill={colors.success}/>
    ) : (
      <Close style={assertionIconStyle} fill={colors.danger}/>
    )
  },
  render(){
    return(
      <div title={this.getTitle()} className={`assertion-counter ${this.state.passing ? 'success' : 'danger'}`}>
      {this.props.label+1}
      <div className={`assertion-validation ${this.isActive()}`}>
      {this.getSmallIcon()}
      </div>
    </div>
    )
  }
});

export default Radium(AssertionCounter);