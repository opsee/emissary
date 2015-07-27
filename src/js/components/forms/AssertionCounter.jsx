import React from 'react';
import OpseeLabel from '../forms/OpseeLabel.jsx';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import _ from 'lodash';
import slate from 'slate';

export default React.createClass({
  getInitialState(){
    return this.props;
  },
  assertionPassing(){
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
    return test && test.success;
  },
  getTitle(){
    return this.assertionPassing() ? 'Assertion is currently passing.' : 'Assertion is currently failing.'
  },
  render(){
    return(
      <div title={this.getTitle()} className={`assertion-counter ${this.assertionPassing() ? 'success' : 'danger'}`} ng-className="{success: assertionPassing($index).success, danger: !assertionPassing($index).success && assertion.relationship}">
      {this.props.label+1}
      <div className="assertion-validation" ng-className="{active: assertion.relationship}">
      {
       /* <svg className="assertion-icon success" ng-show="assertionPassing($index).success" className="" viewBox="0 0 24 24"><use xlink:href="#ico_checkmark" /></svg>
        <svg className="assertion-icon danger" ng-show="!assertionPassing($index).success" className="" viewBox="0 0 24 24"><use xlink:href="#ico_close" /></svg>*/
      }
      </div>
    </div>
    )
  }
});