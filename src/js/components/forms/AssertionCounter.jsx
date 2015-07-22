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
      response:{
        "data": [
          {
            "code": "100",
            "phrase": "Continue",
            "description": "\"indicates that the initial part of a request has been received and has not yet been rejected by the server $$$.\"",
          },
          {
            "code": "101",
            "phrase": "Switching Protocols",
            "description": "\"indicates that the server understands and is willing to comply with the client's request, via the Upgrade header field, for a change in the application protocol being used on this connection.\"",
          },
        ],
        "status": 200,
        "statusText": "OK",
        "headers": {
          "date": "Mon, 29 Jun 2015 17:49:21 GMT",
          "last-modified": "Tue, 16 Jun 2015 17:15:06 GMT",
          "content-type": "application/json",
          "cache-control": "public, max-age=0"
        }
      }
    })
    console.log(test);
    return test && test.success;
  },
  render(){
    return(
      <div className={`assertion-counter ${this.assertionPassing() ? 'success' : 'danger'}`} ng-className="{success: assertionPassing($index).success, danger: !assertionPassing($index).success && assertion.relationship}">
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