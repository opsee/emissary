import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Padding, Col, Grid, Row} from '../layout';
import instanceImg from '../../../img/tut-ec2-instance.svg';
import regions from '../../modules/regions';
import style from './onboard.css';

const LaunchInstance = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        region: PropTypes.string,
        selectedVPC: PropTypes.string,
        selectedSubnet: PropTypes.string,
        vpcsForSelection: PropTypes.array,
        subnetsForSelection: PropTypes.array
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
  // TODO roll these into one API call
  componentWillMount(){
    this.props.actions.hasRole();
  },
  componentWillReceiveProps(nextProps) {
    const region = nextProps.redux.onboard.role.region;
    const hasScanned = !!nextProps.redux.asyncActions.onboardScanRegion.status;
    if (region && !hasScanned) {
      this.props.actions.scanRegion(region);
    }
  },
  getConfig(){
    // TODO switch VPCs/subnets to map so selectedVPC/Subnet can remain ID
    const region = _.chain(regions).filter(r => {
      return r.id === this.props.redux.onboard.region;
    }).first().value() || {};
    const vpc = _.chain(this.props.redux.onboard.vpcsForSelection).filter(s => {
      return s.vpc_id === this.props.redux.onboard.selectedVPC;
    }).first().value() || {};
    const subnet  = _.chain(this.props.redux.onboard.subnetsForSelection).filter(s => {
      return s.subnet_id === this.props.redux.onboard.selectedSubnet;
    }).first().value() || {};
    return { region, vpc, subnet };
  },

  renderConfig(){
    const { region, vpc, subnet } = this.getConfig(); // FIXME do in reducer
    if (this.props.redux.asyncActions.onboardScanRegion.status === 'pending') {
      return (
        <Padding tb={2} className="text-center">
          <span>Scanning your environment in {this.props.redux.onboard.region}...</span>
        </Padding>
      );
    }
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
  renderInner(){
    return (
      <div>
        <Padding tb={2}>
          <div className={style.headerStep}>STEP 2 of 3</div>
          <h2>Install the Opsee EC2 instance</h2>
        </Padding>
        <Padding a={4} className="text-center">
          <img src={instanceImg} style={{maxHeight: '300px'}}/>
        </Padding>
        <p>Lastly, we need to install the Opsee EC2 instance. It's responsible for running checks in your AWS environment.</p>
        <p>Here's our best guess on where we should install it:</p>
        {this.renderConfig()}
        {this.renderButtons()}
      </div>
    );
  },
  renderButtons(){
    return (
      <Padding tb={2}>
        <Padding b={1}>
          <Button to="/start/configure-instance" color="primary" flat block>Change location</Button>
        </Padding>
        <Padding b={1}>
          <Button to="/start/install-example" color="primary" block chevron>Ready, Set, Install</Button>
        </Padding>
        <Padding tb={1} className="text-center">
          <p><small><Link to="review-instance">Learn more about the Opsee instance.</Link></small></p>
        </Padding>
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
