import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {RadioSelect} from '../forms';
import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Padding, Col, Grid, Row} from '../layout';
import regions from '../../modules/regions';
import style from './onboard.css';

const ConfigureInstance = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        selectedVPC: PropTypes.string,
        selectedSubnet: PropTypes.string,
        region: PropTypes.string,
        vpcsForSelection: PropTypes.array,
        subnetsForSelection: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        onboardScanRegion: PropTypes.obj
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
  getInitialState(){
    return {
      region: 'us-west-1',
      subnets: ['my-subnet-0', 'my-subnet-1'],
      selectedSubnet: null,
      vpcs: ['my-vpc-0', 'my-vpc-1', 'my-vpc-2'],
      selectedVPC: null
    };
  },
  getRegions() {
    return _.map(regions, region => {
      return _.assign({
        label: `<strong>${region.id}</strong></br><small>${region.name}</small>`
      }, region);
    });
  },
  getVPCs() {
    return this.props.redux.onboard.vpcsForSelection.map(v => {
      let vpcID = _.get(v, 'vpc_id');
      let labelName = v.name ? `<strong>${v.name}</strong> - ` : '';
      return _.assign({}, v, {
        id: vpcID,
        label: `${labelName}${vpcID}<br/><small>(${_.get(v, 'instance_count')} instances)</small>`
      });
    });
  },
  getSubnets() {
    return _.filter(this.props.redux.onboard.subnetsForSelection, s => {
      return s.vpc_id === this.props.redux.onboard.selectedVPC;
    }).map(s => {
      let labelName = s.name ? `<strong>${s.name}</strong> - ` : '';
      return _.assign({
        id: _.get(s, 'subnet_id'),
        label: `${labelName}${_.get(s, 'subnet_id')}<br/><small>(${_.get(s, 'instance_count')} instances, ${_.get(s, 'routing')} routing)</small>`
      }, s);
    });
  },
  onSave(){
    return this.props.onSave({
      region: this.state.region,
      vpc: this.state.selectedVPC,
      subnet: this.state.selectedSubnet
    });
  },
  handleSelect(){

  },
  renderButtons(vals, key){
    return (
      <div className="display-flex">
        <div className="flex-1">
          {_.map(vals, (val, i) => {
            return (
              <Button onClick={this.setState.bind(this, {[key]: val})} flat color="primary" key={i} style={{margin: '0.5rem'}}>{val}</Button>
            );
          })}
        </div>
      </div>
    );
  },
  renderChooseSubnet() {
    return (
      <div>
        <div><strong>Choose a subnet:</strong></div>
        {this.renderButtons(this.state.subnets, 'selectedSubnet')}
      </div>
    );
  },
  renderChosen(name, val){
    return (
      <Padding tb={2}>
        <div><strong>{name}</strong></div>
        <Button flat color="text" style={{margin: '0.5rem'}}>{val}</Button>
      </Padding>
    );
  },
  render(){
    const isScanPending = this.props.redux.asyncActions.onboardScanRegion.status === 'pending';
    const {region, selectedVPC, selectedSubnet} = this.props.redux.onboard;
    const isDone = region && selectedVPC && selectedSubnet;
    const selectData = _.pick(this.props.redux.onboard, ['region', 'selectedVPC', 'selectedSubnet']);
    return (
      <div className={style.transitionPanel}>
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

                <RadioSelect onChange={this.handleSelect} data={selectData} options={this.getRegions()} path="region" />
              </Padding>

              <Padding tb={1}>
                <Padding tb={1}>
                  <h4>Choose a VPC</h4>
                </Padding>

                <RadioSelect onChange={this.handleSelect} data={selectData} options={this.getVPCs()} path="selectedVPC"/>
              </Padding>

              <Padding tb={1}>
                <Padding tb={1}>
                  <h4>Choose a Subnet</h4>
                </Padding>

                <RadioSelect onChange={this.handleSelect} data={selectData} options={this.getSubnets()} path="selectedSubnet"/>
              </Padding>

              <Padding tb={2}>
                <Button to="/start/launch-instance" color="primary" disabled={isScanPending || !isDone} block>Save configuration</Button>
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
