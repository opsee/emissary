import React from 'react';
import {ArrowRight} from '../icons';
import {StepCounter} from '../global';
import img from '../../../img/tut-discovery.svg';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';

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
              <h2>Opsee Discovers Your Infrastructure</h2>
              <p>The Bastion Instance then uses AWS APIs to discover your instances and groups. The bastion is always scanning, and detects changes to infrastructure automatically.</p>
              <Padding t={2}>
                <Button to="/start/tutorial/3" color="success" block>Next <ArrowRight inline/></Button>
              </Padding>
              <StepCounter active={2} steps={3}/>
            </Col>
          </Row>
        </Grid>
      );
    }
    return null;
  }
});
