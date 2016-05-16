import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Padding, Col, Grid, Row} from '../layout';
import instanceImg from '../../../img/tut-ec2-instance.svg';
import ConfigureInstance from './ConfigureInstance';
import style from './onboard.css';

const LaunchInstance = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        region: PropTypes.string,
        selectedVPC: PropTypes.string,
        selectedSubnet: PropTypes.string
      }),
      asyncActions: PropTypes.shape({
        onboardScanRegion: PropTypes.object
      })
    }),
    actions: PropTypes.shape({
      hasRole: PropTypes.func,
      scanRegion: PropTypes.func
    })
  },
  componentWillMount(){
    this.props.actions.hasRole();
  },
  getInitialState(){
    return {
      showConfigure: false
    };
  },
  componentWillReceiveProps(nextProps) {
    const region = nextProps.redux.onboard.role.region;
    const hasScanned = !!nextProps.redux.asyncActions.onboardScanRegion.status;
    if (region && !hasScanned) {
      this.props.actions.scanRegion(region);
    }
  },
  onConfigure(config){
    this.setState(_.assign({
      showConfigure: false
    }, config));
  },
  renderConfig(){
    const {region, selectedVPC, selectedSubnet} = this.props.redux.onboard;
    if (this.props.redux.asyncActions.onboardScanRegion.status === 'pending') {
      return (
        <Padding tb={2} className="text-center">
          <span>Scanning your environment in {region}...</span>
        </Padding>
      );
    }
    return (
      <Padding tb={2} className="text-center">
        <h3 style={{color: 'white', 'fontWeight': 300}}>{region} <span style={{opacity: 0.3}}>></span> {selectedVPC} <span style={{opacity: 0.3}}>></span> {selectedSubnet}</h3>
        <p><small><a href="#" onClick={this.setState.bind(this, {showConfigure: true})}>(Change)</a></small></p>
      </Padding>
    );
  },
  renderInner(){
    if (this.state.showConfigure) {
      return (
        <div>
          <ConfigureInstance onSave={this.onConfigure} onDismiss={this.setState.bind(null, {showConfigure: false})} />
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
        {this.renderConfig()}
        {this.renderButtons()}
      </div>
    );
  },
  renderButtons(){
    return (
      <Padding tb={2}>
        <Padding b={1}>
          <Button to="/start/install-example" color="primary" block chevron>Ready, Set, Install</Button>
        </Padding>
        <Button to="/start/review-instance" color="primary" flat block>About the Opsee Instance</Button>
      </Padding>
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
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchInstance);
