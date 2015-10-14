import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import statics from '../../modules/statics';
import {StepCounter} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import img from '../../../img/tut-bastion';

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
        <Col xs={12}>
          <img className="step-image" src={img}/>
          <h2>First, Add the Bastion Instance</h2>
          <p>The first thing we do is add the Bastion Instance to your AWS environment. <a href="/docs/Bastion">Learn more about the Bastion Instance</a> in our docs.</p>
          <div className="clearfix"><br/></div>
          <div className="clearfix">
            <Link to="tutorial2" className="btn btn-success btn-raised btn-block">
              Next&nbsp;<ChevronRight inline={true}/>
            </Link>
          </div>
          <StepCounter active={1} steps={3}/>
          </Col>
        </Row>
      </Grid>
    );
  }
});
