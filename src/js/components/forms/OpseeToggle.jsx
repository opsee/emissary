import React, {PropTypes} from 'react';
import _ from 'lodash';

export default React.createClass({
  onClick(){
    this.props.onChange.call(null, this.props.id);
  },
  isActive(){
    return this.props.on ? 'active' : '';
  },
  render(){
    return (
      <div className={`toggle-switch ${this.isActive()}`} ng-swipe-left="ngModel = false" ng-swipe-right="ngModel = true" ng-click="ngModel = !ngModel" onClick={this.onClick}>
        <div className="knob"></div>
      </div>
    );
  }
});