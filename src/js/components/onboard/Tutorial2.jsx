import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import {StepCounter} from '../global';
import img from '../../../img/tut-discovery.svg';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';

export default React.createClass({
  statics: {
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
              <h2>Opsee Discovers Your Infrastructure</h2>
              <p>The Bastion Instance then uses AWS APIs to discover your instances and groups. The bastion is always scanning, and detects changes to infrastructure automatically.</p>
              <Padding t={2}>
                <Button to="tutorial3" color="success" block chevron>Next</Button>
              </Padding>
              <StepCounter active={2} steps={3}/>
            </Col>
          </Row>
        </Grid>
    );
  }
});
