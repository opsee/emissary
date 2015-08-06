import React from 'react';
import OpseeLabel from '../forms/OpseeLabel.jsx';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import _ from 'lodash';
import slate from 'slate';
import CheckmarkIcon from '../icons/Checkmark.jsx';
import CloseIcon from '../icons/Close.jsx';
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
  setAssertionPassing(){
    /* 
      this.state.fields should be an array of BoundFields
    */
    let obj = {
      key:_.find(this.state.fields, field => field.name == 'type').value(),
      relationship:_.find(this.state.fields, field => field.name == 'relationship').value(),
      operand:_.find(this.state.fields, field => field.name == 'operand').value()
    }
    var test = slate.testAssertion({
      assertion:obj,
      response:this.state.response
    })
    this.setState({
      passing:test && test.success
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
      <CheckmarkIcon style={assertionIconStyle} fill={colors.success}/>
    ) : (
      <CloseIcon style={assertionIconStyle} fill={colors.danger}/>
    )
  },
  render(){
    return(
      <div title={this.getTitle()} className={`assertion-counter ${this.state.passing ? 'success' : 'danger'}`}>
      {this.props.label+1}
      <div className={`assertion-validation ${this.isActive()}`} ng-className="{active: assertion.relationship}">
      {this.getSmallIcon()}
      </div>
    </div>
    )
  }
});

export default Radium(AssertionCounter);