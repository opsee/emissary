import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import cx from 'classnames';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {StatusHandler} from '../global';
import {Padding, Col, Grid, Row} from '../layout';
import instanceImg from '../../../img/tut-ec2-instance.svg';
import style from './onboard.css';

const LaunchInstance = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        region: PropTypes.string,
        installData: PropTypes.object
      }),
      asyncActions: PropTypes.shape({
        onboardScanRegion: PropTypes.object
      }),
      app: PropTypes.shape({
        scheme: PropTypes.string
      })
    }),
    actions: PropTypes.shape({
      initializeInstallation: PropTypes.func
    })
  },
  componentWillMount(){
    if (!this.props.redux.onboard.installData) {
      this.props.actions.initializeInstallation();
    }
  },
  getInstallData(){
    return this.props.redux.onboard.installData || {};
  },
  renderLoading(){
    return (
      <Padding tb={2} className="text-center">
        <Padding b={2}>
          <StatusHandler status="pending" />
        </Padding>
        <p className={style.subtext}>Scanning your environment...</p>
      </Padding>
    );
  },
  renderRegion(){
    const region = this.getInstallData().region || {};
    return (
      <Padding tb={2}>
        <div className={style.configKey}>
          Region
        </div>
        <div className={style.configMain}>
          {region.id}
        </div>
        <div className={style.subtext}>
          {region.name}
        </div>
      </Padding>
    );
  },
  renderVPC(){
    const vpc = this.getInstallData().vpc || {};
    return (
      <Padding tb={2}>
        <div className={style.configKey}>
          VPC
        </div>
        <div className={style.configMain}>
          {vpc.vpc_id}
        </div>
        <div className={style.subtext}>
          {vpc.name}
        </div>
        <div className={style.subtext}>
          {vpc.instance_count} instances
        </div>
      </Padding>
    );
  },
  renderSubnet(){
    const subnet = this.getInstallData().subnet || {};
    return (
      <Padding tb={2}>
        <div className={style.configKey}>
          Subnet
        </div>
        <div className={style.configMain}>
          {subnet.subnet_id}
        </div>
        <div className={style.subtext}>
          {subnet.name}
        </div>
        <div className={style.subtext}>
          {subnet.instance_count} instances, {subnet.routing} routing
        </div>
      </Padding>
    );
  },
  renderConfig(){
    if (!this.props.redux.onboard.installData) {
      return this.renderLoading();
    }
    return (
      <div>
        <p>Here's where it'll be installed:</p>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={4}>
              {this.renderRegion()}
            </Col>
            <Col xs={12} sm={4}>
              {this.renderVPC()}
            </Col>
            <Col xs={12} sm={4}>
              {this.renderSubnet()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
  render(){
    return (
      <div className={cx(style.transitionPanel, style[this.props.redux.app.scheme])}>
        <Padding tb={2}>
          <div className={style.headerStep}>STEP 2 of 3</div>
          <h2>Install the Opsee EC2 instance</h2>
        </Padding>
        <Padding a={4} className="text-center">
          <img src={instanceImg} style={{maxHeight: '300px'}}/>
        </Padding>

        <p>Lastly, we need to install the Opsee EC2 instance. It&rsquo;s responsible for running checks in your AWS environment.</p>
        {this.renderConfig()}

        <Padding tb={2}>
          <Padding b={1}>
            <Button to="/start/configure-instance" disabled={!this.props.redux.onboard.installData} color="primary" flat block>Change location</Button>
          </Padding>
          <Padding b={1}>
            <Button to="/start/install" disabled={!this.props.redux.onboard.installData} color="primary" block chevron>Ready, Set, Install</Button>
          </Padding>
          <Padding tb={1} className="text-center">
            <p><small><Link to="/start/review-instance">Learn more about the Opsee instance</Link></small></p>
          </Padding>
        </Padding>
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