import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';

export default React.createClass({
  render(){
    return(
      <div className="md-toolbar md-medium-tall">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1 md-toolbar-inner">
              <div className="pull-left" ng-if="btnPosition == 'left'" style={{marginRight:"1em"}}>
                <button className="btn btn-icon btn-flat" ng-click="close()">
                </button>
              </div>
              <h1 className="margin-none">{this.props.title}</h1>
              <div className="md-toolbar-bottom-right" ng-if="btnPosition != 'left'">
                <button className="btn btn-icon btn-flat" ng-click="close()">
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})