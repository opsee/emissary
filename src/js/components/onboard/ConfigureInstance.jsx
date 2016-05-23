import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link, History} from 'react-router';

import {Close} from '../icons';
import {RadioSelect} from '../forms';
import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Padding, Col, Grid, Row} from '../layout';
import style from './onboard.css';

const ConfigureInstance = React.createClass({
  mixins: [History],
  propTypes: {
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        selectedRegion: PropTypes.object,
        selectedVPC: PropTypes.string,
        selectedSubnet: PropTypes.string,
        region: PropTypes.string,
        regions: PropTypes.array,
        installData: PropTypes.object
      }),
      asyncActions: PropTypes.shape({
        onboardScanRegion: PropTypes.obj
      })
    }),
    actions: PropTypes.shape({
      initializeInstallation: PropTypes.func,
      setRegion: PropTypes.func,
      subnetSelect: PropTypes.func,
      vpcSelect: PropTypes.func,
      updateInstallData: PropTypes.func
    })
  },
  componentWillMount(){
    const { installData } = this.props.redux.onboard; // TODO should this be a redirect
    if (!installData) {
      this.props.actions.initializeInstallation();
    }
  },
  getSelectedRegion(){
    return this.props.redux.onboard.selectedRegion || {};
  },
  getRegions() {
    return _.map(this.props.redux.onboard.regions, region => {
      return _.assign({
        label: `<strong>${region.id}</strong>&nbsp;&nbsp;(${region.name})`
      }, region);
    });
  },
  getVPCs() {
    return _.get(this.getSelectedRegion(), 'vpcs', []);
  },
  getSubnets() {
    const subnets = _.get(this.getSelectedRegion(), 'subnets', []);
    const selectedVPC = this.props.redux.onboard.selectedVPC;
    return _.filter(subnets, s => {
      return selectedVPC ? s.vpc_id === selectedVPC : true;
    });
  },
  onRegionSelect(data) {
    const regionID = _.get(data, 'id');
    this.props.actions.setRegion(regionID);
  },
  onSave() {
    this.props.actions.updateInstallData();
    this.history.pushState(null, '/start/launch-instance');
  },
  render(){
    const isScanPending = this.props.redux.asyncActions.onboardScanRegion.status === 'pending';
    const {selectedRegion, selectedVPC, selectedSubnet} = this.props.redux.onboard;
    const selectState = _.pick(this.props.redux.onboard, ['selectedRegion', 'selectedVPC', 'selectedSubnet']);
    const isDone = selectedVPC && selectedSubnet;

    return (
      <div className={style.transitionPanel}>
        <Link to="/start/launch-instance" className={style.closeWrapper}>
          <Close className={style.closeButton} />
        </Link>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={2}>
                <h2>Configure Instance</h2>
              </Padding>

              <p>Choose where the Opsee instance should be installed in your AWS environment.</p>

              <Padding tb={1}>
                <Padding tb={1}>
                  <h4>Choose a Region</h4>
                </Padding>

                <RadioSelect onChange={this.onRegionSelect} data={selectedRegion} options={this.getRegions()} path="id" />
              </Padding>

              <Padding tb={1}>
                <Padding tb={1}>
                  <h4>Choose a VPC</h4>
                </Padding>
                {isScanPending ? 'loading...' : <RadioSelect onChange={this.props.actions.vpcSelect} data={selectState} options={this.getVPCs()} path="selectedVPC"/>}
              </Padding>

              <Padding tb={1}>
                <Padding tb={1}>
                  <h4>Choose a Subnet</h4>
                </Padding>
                {isScanPending ? 'loading...' : <RadioSelect onChange={this.props.actions.subnetSelect} data={selectState} options={this.getSubnets()} path="selectedSubnet"/>}
              </Padding>

              <Padding t={2} b={1}>
                <Button onClick={this.onSave} color="primary" disabled={isScanPending || !isDone} block>Save configuration</Button>
              </Padding>
              <Padding b={1}>
                <Button to="/start/launch-instance" color="primary" flat block>Cancel</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureInstance);
