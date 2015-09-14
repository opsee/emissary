import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import {StepCounter} from '../global';

export default React.createClass({
  statics:{
    willTransitionTo(transition, params, query, cb){
      const newImg = new Image();
      newImg.src = '/img/tut-checks3.svg';
      newImg.onload = () => cb();
    }
  },
  render() {
    return (
       <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <img className="step-image" src="/img/tut-checks3.svg"/>
              <h2>Create Health Checks, but Don't Maintain Them</h2>
              <p>In Opsee you can create health checks for security groups, ELBs, and soon other entities like EC2 Tags, Regions, or Availability Zones. Opsee applies these checks to the right instances for you, and knows when new instances come online.</p>
              <div className="clearfix"><br/></div>
              <div className="clearfix">
                <Link to="onboardRegionSelect" className="btn btn-success btn-raised btn-block">
                  Start Installation&nbsp;<ChevronRight inline={true}/>
                </Link>
              </div>
              <StepCounter active={3} steps={3}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
