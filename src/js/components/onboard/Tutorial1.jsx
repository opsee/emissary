import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import statics from '../../modules/statics';
import {StepCounter} from '../global';

export default React.createClass({
  statics:{
      willTransitionTo(transition, params, query, cb){
        const newImg = new Image();
        newImg.src = '/img/tut-checks.svg';
        newImg.onload = () => cb();
    }
  },
  render() {
    return (
       <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 col-md-offset-1">
              <img src="/img/tut-checks.svg"/>
              <h2>First, You Create Health Checks</h2>
              <p>You create health and performance checks for your services, Opsee manages them for you. Checks are automatically applied to the right instances and added to new instances when they come online.</p>
              <div className="clearfix"><br/></div>
              <div className="clearfix">
                <Link to="tutorial2" className="btn btn-primary btn-block">
                  Next&nbsp;<ChevronRight inline={true}/>
                </Link>
              </div>
              <StepCounter active={1} steps={2}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
