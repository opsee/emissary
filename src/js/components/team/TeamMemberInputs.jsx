import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Padding} from '../layout';
import {Button, Input, RadioSelect} from '../forms';
import {Color, Heading} from '../type';

const TeamMemberInputs = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    inputs: PropTypes.array,
    capabilities: PropTypes.array,
    name: PropTypes.string,
    status: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string
  },
  getDefaultProps(){
    return {
      inputs: ['status', 'capabilities', 'email', 'password']
    };
  },
  getStatuses(){
    return [
      {
        id: 'active',
        label: 'Active: Normal operation'
      },
      {
        id: 'inactive',
        label: 'Inactive: Disable login and all user functions'
      }
    ];
  },
  handleInputChange(data){
    this.props.onChange(_.assign({}, this.props, data));
  },
  handleCapabilityClick(id){
    let arr = _.clone(this.props.capabilities);
    if (arr.indexOf(id) === -1){
      arr = arr.concat([id]);
    } else {
      arr = _.reject(arr, i => i === id);
    }
    this.props.onChange(_.assign({}, this.props, {
      capabilities: arr
    }));
  },
  renderCapabilities(){
    if (this.props.inputs.indexOf('capabilities') > -1){
      const data = ['management', 'billing', 'editing'];
      const titles = ['User Management', 'View and Edit Billing', 'Check Editing'];
      return (
        <Padding t={1} b={1}>
          <Heading level={3}>Capabilities</Heading>
          <div className="display-flex flex-wrap">
            {data.map((c, i) => {
              return (
                <Padding r={1} b={1} key={`capabilitiy-${c}`}>
                  <Button onClick={this.handleCapabilityClick.bind(null, c)} flat={this.props.capabilities.indexOf(c) === -1} color="primary">
                    {titles[i]}
                  </Button>
                </Padding>
              );
            })}
          </div>
          <small><em><Color c="gray5">Every user will have the ability to view checks and environment details</Color></em></small>
        </Padding>
      );
    }
    return null;
  },
  renderStatus(){
    if (this.props.inputs.indexOf('status') > -1){
      if (this.props.status === 'invited'){
        return (
          <div>
            <Heading level={3}>Status</Heading>
            <Padding b={1}>{this.props.name} has been invited to your team.</Padding>
          </div>
        );
      }
      return (
        <div>
          <Heading level={3}>Status</Heading>
          <RadioSelect onChange={this.handleInputChange} data={this.props} options={this.getStatuses()} path="status"/>
        </div>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        {this.renderStatus()}
        {this.renderCapabilities()}
        {this.props.inputs.indexOf('email') > -1 && (
          <Padding b={1}>
            <Input onChange={this.handleInputChange} data={this.props} path="email" label="Email*" placeholder="address@domain.com"/>
          </Padding>
        ) || null}
        {this.props.inputs.indexOf('password') > -1 && (
          <Padding b={1}>
            <Input onChange={this.handleInputChange} data={this.props} path="password" label="New Password" placeholder="****" type="password"/>
          </Padding>
        ) || null}
      </div>
    );
  }
});

export default TeamMemberInputs;