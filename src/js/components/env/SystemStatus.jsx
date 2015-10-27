import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';
import {Button} from '../forms';

const SystemStatus = React.createClass({
  mixins: [OnboardStore.mixin],
  storeDidChange(){
    if (OnboardStore.getGetBastionsStatus() == 'success'){
      this.setState({
        bastions: OnboardStore.getBastions() || []
      })
    }
  },
  getInitialState(){
    return {
      bastions: undefined
    }
  },
  componentWillMount(){
    OnboardActions.getBastions();
  },
  getConnectedBastions(){
    return this.state.bastions.length;
  },
  renderBastionsInfo(){
    if (this.state.bastions){
      return (
        <div>
          Connected Bastions: {this.getConnectedBastions()}
        </div>
      )
    }else{
      return <div/>
    }
  },
  render() {
    return (
      <div>
        <Toolbar title="System Status"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderBastionsInfo()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default SystemStatus;