/* eslint-disable */
import _ from 'lodash';
import React, {PropTypes} from 'react';
import {History} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Heading} from '../type';
import {Button} from '../forms';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import instanceImg from '../../../img/tut-ec2-instance.svg';
import ReviewInstance from './ReviewInstance';
import ConfigureInstance from './ConfigureInstance';
import style from './onboard.css';

const LaunchInstance = React.createClass({
  componentWillMount(){
    this.props.actions.hasRole();
  },
  getInitialState(){
    return {
      showConfigure: false,
      showInfo: false,
      region: 'us-west-1',
      subnet: 'some-cool-subnet',
      vpc: 'some-cool-vpc'
    };
  },
  toggleInfo(shouldShow) {
    this.setState({ showInfo: shouldShow });
  },
  toggleConfigure(shouldShow) {
    this.setState({ showConfigure: shouldShow });
  },
  onConfigure(config){
    this.setState(_.assign({
      showConfigure: false
    }, config));
  },
  renderInner(){
    if (this.state.showConfigure) {
      return (
        <div>
          <ConfigureInstance onSave={this.onConfigure} />
        </div>
      );
    }
    if (this.state.showInfo) {
      return (
        <div>
          <ReviewInstance />
          <Padding tb={1}>
            <Button onClick={this.toggleInfo.bind(this, false)} color="primary" block>Got it</Button>
          </Padding>
        </div>
      );
    }
    return (
      <div>
        <Padding lr={4} tb={2} className="text-center">
          <img src={instanceImg} style={{maxHeight: '300px'}}/>
        </Padding>

        <Padding tb={2}>
          <h2>Install the Opsee EC2 instance.</h2>
        </Padding>

        <p>Lastly, we need to install the Opsee EC2 instance. It's responsible for running checks in your AWS environment.</p>

        <p>Here's our best guess on where we should install it, based on your environment:</p>

        <Padding tb={2} className="text-center">
          <h3 style={{color: 'white', 'fontWeight': 300}}>{this.props.redux.onboard.region} > {this.state.vpc} > {this.state.subnet}</h3>
          <p><small><a href="#" onClick={this.toggleConfigure.bind(this, true)}>(Change)</a></small></p>
        </Padding>

        <Padding tb={1}>
          <Padding b={1}>
            <Button onClick={this.toggleInfo.bind(this, true)} color="primary" block>Learn More</Button>
          </Padding>
          <Padding b={1}>
            <Button to="/start/install-example" color="success" block chevron>Ready, set, launch!</Button>
          </Padding>
        </Padding>
      </div>
    );
  },
  render(){
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
})

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchInstance);
