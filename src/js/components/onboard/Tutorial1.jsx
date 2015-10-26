import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import statics from '../../modules/statics';
import {StepCounter} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import img from '../../../img/tut-bastion';
import {Button} from '../forms';
import {Padding} from '../layout';

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
          <Padding t={2}>
            <Button to="tutorial2" color="success" block={true} chevron={true}>Next</Button>
          </Padding>
          <StepCounter active={1} steps={3}/>
          </Col>
        </Row>
      </Grid>
    );
  }
});
