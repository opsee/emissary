/* eslint-disable */
import _ from 'lodash';
import React, {PropTypes} from 'react';
import {History, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Padding} from '../layout';
import {SetInterval} from '../../modules/mixins';
import style from './onboard.css';

const ConfigureInstance = React.createClass({
  getInitialState(){
    return {
      region: 'us-west-1',
      subnets: ['my-subnet-0', 'my-subnet-1'],
      selectedSubnet: null,
      vpcs: ['my-vpc-0', 'my-vpc-1', 'my-vpc-2'],
      selectedVPC: null
    };
  },
  onSave(){
    return this.props.onSave({
      region: this.state.region,
      vpc: this.state.selectedVPC,
      subnet: this.state.selectedSubnet
    });
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
  renderSubnet(){
    return this.state.selectedSubnet ?
      this.renderChosen('subnet', this.state.selectedSubnet) :
      this.renderChooseSubnet();
  },
  renderVPC(){
    if (!this.state.selectedSubnet) {
      return null;
    }
    if (this.state.selectedVPC) {
      return this.renderChosen('vpc', this.state.selectedVPC);
    }
    return (
      <Padding tb={2}>
        <div><strong>Choose a VPC:</strong></div>
        {this.renderButtons(this.state.vpcs, 'selectedVPC')}
      </Padding>
    );
  },
  render(){
    const isDone = this.state.region && this.state.selectedVPC && this.state.selectedSubnet;

    return (
      <div>
        <h2>Configure Instance</h2>

        {this.renderChosen('region', this.props.redux.onboard.region)}
        {this.renderSubnet()}
        {this.renderVPC()}

        <Padding t={2} b={1}>
          <Button onClick={this.onSave} color="success" disabled={!isDone} block>Save configuration</Button>
        </Padding>
        <Padding b={1}>
          <Button onClick={this.props.onDismiss} block>Cancel</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureInstance);
