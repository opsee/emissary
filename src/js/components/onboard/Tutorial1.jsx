import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import statics from '../../modules/statics';
import {StepCounter} from '../global';

export default React.createClass({
  statics:{
      willTransitionTo(transition, params, query, cb){
        const newImg = new Image();
        newImg.src = '/img/tut-bastion2.svg';
        newImg.onload = () => cb();
    }
  },
  render() {
    return (
       <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <img className="step-image" src="/img/tut-bastion2.svg"/>
              <h2>First, Add the Bastion Instance</h2>
              <p>The first thing we do is add the Bastion Instance to your AWS environment. <a href="/docs/Bastion">Learn more about the Bastion Instance</a> in our docs.</p>
              <div className="clearfix"><br/></div>
              <div className="clearfix">
                <Link to="tutorial2" className="btn btn-success btn-raised btn-block">
                  Next&nbsp;<ChevronRight inline={true}/>
                </Link>
              </div>
              <StepCounter active={1} steps={3}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
