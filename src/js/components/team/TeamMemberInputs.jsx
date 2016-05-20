import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Padding} from '../layout';
import {Button, Checkbox, Input, RadioSelect} from '../forms';
import {Color, Heading} from '../type';
import {Member} from '../../modules/schemas';
import {
  team as actions
} from '../../actions';

const TeamMemberInputs = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    inputs: PropTypes.array,
    capabilities: PropTypes.array,
    name: PropTypes.string,
    status: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        memberInvite: PropTypes.object
      })
    })
  },
  getDefaultProps(){
    return _.assign({
      inputs: ['status', 'capabilities', 'email']
    }, new Member().toJS());
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
  runSendInvite(){
    this.props.actions.memberInvite(this.props.email);
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
              const selected = this.props.capabilities.indexOf(c) !== -1;
              const id = `team-member-capabilitiy-${i}`;
              return (
                <Padding r={1} b={1} key={`capabilitiy-${c}`} className="display-flex flex-vertical-align">
                  <Checkbox onChange={this.handleCapabilityClick.bind(null, c)} selected={selected} id={id} color="primary"/>
                  <label htmlFor={id}><Color c={selected ? 'primary' : null}>{titles[i]}</Color></label>
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
    const {props} = this;
    if (props.inputs.indexOf('status') > -1){
      if (props.status === 'invited'){
        const inviteStatus = props.redux.asyncActions.teamMemberInvite.status;
        const pending = inviteStatus === 'pending';
        const success = inviteStatus === 'success' && props.redux.asyncActions.teamMemberInvite.meta === props.email;
        let text = 'Resend Invitation';
        if (pending){
          text = 'Sending...';
        } else if (success){
          text = 'Invitation Resent.';
        }
        return (
          <Padding b={1}>
            <Heading level={3}>Status</Heading>
            <Padding b={1}>{props.name || props.email} has been invited to your team.</Padding>
            <Button onClick={this.runSendInvite} flat color="default" disabled={pending || success}>{text}</Button>
          </Padding>
        );
      }
      return (
        <div>
          <Heading level={3}>Status</Heading>
          <RadioSelect onChange={this.handleInputChange} data={props} options={this.getStatuses()} path="status"/>
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

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamMemberInputs);