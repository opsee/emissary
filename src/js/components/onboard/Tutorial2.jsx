import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import {StepCounter} from '../global';
import img from '../../../img/tut-discovery.svg';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  statics:{
    willTransitionTo(transition, params, query, cb){
      const newImg = new Image();
      newImg.src = img;
      newImg.onload = () => cb();
    }
  },
  render() {
    return (
       <Grid>
        <Row>
          <Col>
              <img className="step-image" src={img}/>
              <h2>Opsee Discovers Your Infrastructure</h2>
              <p>The Bastion Instance then uses AWS APIs to discover your instances and groups. The bastion is always scanning, and detects changes to infrastructure automatically.</p>
              <div className="clearfix"><br/></div>
              <div className="clearfix">
                <Link to="tutorial3" className="btn btn-success btn-raised btn-block">
                  Next&nbsp;<ChevronRight inline={true}/>
                </Link>
              </div>
              <StepCounter active={2} steps={3}/>
            </Col>
          </Row>
        </Grid>
    );
  }
});
