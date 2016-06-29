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
    perms: PropTypes.object,
    name: PropTypes.string,
    status: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        memberInvite: PropTypes.object
      })
    }),
    actions: PropTypes.shape({
      memberInvite: PropTypes.func
    }).isRequired
  },
  getDefaultProps(){
    return _.assign({
      inputs: ['status', 'perms', 'email']
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
    let obj = _.assign({}, this.props, data);
    obj = _.pick(obj, ['email', 'perms', 'status']);
    obj.perms.edit = !!obj.perms.admin || obj.perms.edit;
    this.props.onChange(obj);
  },
  handleCapabilityClick(id){
    let perms = _.assign({}, this.props.perms, {
      [id]: !this.props.perms[id]
    });
    perms.edit = !!perms.admin || perms.edit;
    this.props.onChange(_.assign({}, this.props, {
      perms
    }));
  },
  renderPerms(){
    if (this.props.inputs.indexOf('perms') > -1){
      const data = ['admin', 'billing', 'edit'];
      const titles = ['Team Admin', 'Billing Management', 'Check Management'];
      return (
        <Padding t={1} b={1}>
          <Heading level={3}>Perms</Heading>
          <div className="display-flex flex-wrap">
            {data.map((c, i) => {
              const selected = !!this.props.perms[c];
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
          <RadioSelect onChange={this.handleInputChange} data={_.omit(props, ['redux'])} options={this.getStatuses()} path="status"/>
        </div>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        {this.renderStatus()}
        {this.renderPerms()}
        {this.props.inputs.indexOf('email') > -1 && (
          <Padding b={1}>
            <Input onChange={this.handleInputChange} data={_.omit(this.props, ['redux'])} path="email" label="Email*" placeholder="address@domain.com"/>
          </Padding>
        ) || null}
        {this.props.inputs.indexOf('password') > -1 && (
          <Padding b={1}>
            <Input onChange={this.handleInputChange} data={_.omit(this.props, ['redux'])} path="password" label="New Password" placeholder="****" type="password"/>
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