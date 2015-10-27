import React, {PropTypes} from 'react';

export default React.createClass({
  render(){
    return (
      <div className="btn-container btn-container-fixed btn-container-bordered-top btn-container-righty">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
            {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});