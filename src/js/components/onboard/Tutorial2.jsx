import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import {StepCounter} from '../global';

export default React.createClass({
  statics:{
    willTransitionTo(transition, params, query, cb){
      const newImg = new Image();
      newImg.src = '/img/tut-bastion.svg';
      newImg.onload = () => cb();
    }
  },
  render() {
    return (
       <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 col-md-offset-1">
              <img src="/img/tut-bastion.svg"/>
              <h2>Then, the Bastion Works for You</h2>
              <p>The Bastion is a prebuilt AMI that runs inside your AWS environment. It automatically discovers your infrastructure and services, and coordinates health checking and incident response. When you run a health check or restart an instance in Opsee, it&rsquo;s the Bastion doing the work.</p>
              <div className="clearfix"><br/></div>
              <div className="clearfix">
                <Link to="onboardRegionSelect" className="btn btn-primary btn-block">
                  Next&nbsp;<ChevronRight inline={true}/>
                </Link>
              </div>
              <StepCounter active={2} steps={2}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
