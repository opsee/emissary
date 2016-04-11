import React from 'react';
import {ArrowRight} from '../icons';
import {StepCounter} from '../global';
import img from '../../../img/tut-bastion';
import {Button} from '../forms';
import {Col, Grid, Padding, Row} from '../layout';
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
            <Heading level={2}>First, Add our instance</Heading>
            <p>First, you add our instance to your AWS environment. The instance is a <a target="_blank" href="https://aws.amazon.com/ec2/instance-types/">t2.micro</a> and is free-tier eligible. To add it to your AWS environment, you&rsquo;ll choose a VPC and subnet (EC2 Classic is not yet supported). <a target="_blank" href="/docs/Bastion">Learn more about our instance</a> in our docs.</p>
            <Padding t={2}>
              <Button to="/start/tutorial/2" color="success" block>Next <ArrowRight inline/></Button>
            </Padding>
            <StepCounter active={1} steps={3}/>
            </Col>
          </Row>
        </Grid>
      );
    }
    return null;
  }
});
