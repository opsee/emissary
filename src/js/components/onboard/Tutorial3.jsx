import React from 'react';
import {ArrowRight} from '../icons';
import {StepCounter} from '../global';
import img from '../../../img/tut-checks.svg';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {Heading} from '../type';

export default React.createClass({
  getInitialState(){
    return {
      loaded: false
    };
  },
  componentWillMount(){
    const newImg = new Image();
    newImg.src = img;
    newImg.onload = () => {
      this.setState({
        loaded: true
      });
    };
  },
  render() {
    if (this.state.loaded){
      return (
       <Grid>
        <Row>
          <Col xs={12}>
            <img className="step-image" src={img}/>
            <Heading level={2}>Create Health Checks, but Don&rsquo;t Maintain Them</Heading>
            <p>In Opsee you can create health checks for security groups, ELBs, and soon other entities like EC2 Tags, Regions, or Availability Zones. Opsee applies these checks to the right instances for you, and knows when new instances come online. To <a target="_blank" href="/docs/checks">learn more about check types and targets</a>, check out our documentation.</p>
            <Padding t={2}>
              <Button to="/start/region-select" color="success" block>Start Installation <ArrowRight inline/></Button>
            </Padding>
            <StepCounter active={3} steps={3}/>
          </Col>
        </Row>
      </Grid>
      );
    }
    return null;
  }
});
