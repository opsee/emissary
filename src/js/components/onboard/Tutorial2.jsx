import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import {StepCounter} from '../global';

export default React.createClass({
  statics:{
    willTransitionTo(transition, params, query, cb){
      const newImg = new Image();
      newImg.src = '/img/tut-discovery.svg';
      newImg.onload = () => cb();
    }
  },
  render() {
    return (
       <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <img className="step-image" src="/img/tut-discovery.svg"/>
              <h2>Opsee Discovers Your Infrastructure</h2>
              <p>The Bastion Instance then uses AWS APIs to discover your instances and groups. The bastion is always scanning, and detects changes to infrastructure automatically.</p>
              <div className="clearfix"><br/></div>
              <div className="clearfix">
                <Link to="tutorial3" className="btn btn-success btn-raised btn-block">
                  Next&nbsp;<ChevronRight inline={true}/>
                </Link>
              </div>
              <StepCounter active={2} steps={3}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
