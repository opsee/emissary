import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
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
        <span>Scanning your environment...</span>
      </Padding>
    );
  },
  renderConfig(){
    if (!this.props.redux.onboard.installData) {
      return this.renderLoading();
    }
    const { region, vpc, subnet } = this.getInstallData();
    return (
      <Padding tb={2}>
        <Grid>
          <Row>
            <Col xs={12} sm={4}>
              <Padding tb={1}>
                <div className={style.configKey}>
                  Region
                </div>
                <div className={style.configMain}>
                  {_.get(region, 'id')}
                </div>
                <div className={style.configSub}>
                  {_.get(region, 'name')}
                </div>
              </Padding>
            </Col>
            <Col xs={12} sm={4}>
              <Padding tb={1}>
                <div className={style.configKey}>
                  VPC
                </div>
                <div className={style.configMain}>
                  {_.get(vpc, 'vpc_id')}
                </div>
                <div className={style.configSub}>
                  {_.get(vpc, 'name')}
                </div>
              </Padding>
            </Col>
            <Col xs={12} sm={4}>
              <Padding tb={1}>
                <div className={style.configKey}>
                  Subnet
                </div>
                <div className={style.configMain}>
                  {_.get(subnet, 'subnet_id')}
                </div>
                <div className={style.configSub}>
                  {_.get(subnet, 'name')}
                </div>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </Padding>
    );
  },
  render(){
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={2}>
                <div className={style.headerStep}>STEP 2 of 3</div>
                <h2>Install the Opsee EC2 instance</h2>
              </Padding>
              <Padding a={4} className="text-center">
                <img src={instanceImg} style={{maxHeight: '300px'}}/>
              </Padding>

              <p>Lastly, we need to install the Opsee EC2 instance. It's responsible for running checks in your AWS environment. Here's where it'll be installed:</p>
              {this.renderConfig()}

              <Padding tb={2}>
                <Padding b={1}>
                  <Button to="/start/configure-instance" disabled={!this.props.redux.onboard.installData} color="primary" flat block>Change location</Button>
                </Padding>
                <Padding b={1}>
                  <Button to="/start/install-example" disabled={!this.props.redux.onboard.installData} color="primary" block chevron>Ready, Set, Install</Button>
                </Padding>
                <Padding tb={1} className="text-center">
                  <p><small><Link to="/start/review-instance">Learn more about the Opsee instance</Link></small></p>
                </Padding>
              </Padding>
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
