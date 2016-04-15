import React, {PropTypes} from 'react';
import _ from 'lodash';
import NotificationSelection from './NotificationSelection';

const MultiEdit = React.createClass({
  propTypes: {
    checks: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      notifications: this.getNotifications()
    };
  },
  getNotifications(){
    const checks = this.props.checks.toJS ? this.props.checks.toJS() : this.props.checks;
    return _.chain(checks)
    .filter(check => check.selected)
    .map('notifications')
    .flatten()
    .uniqBy(notif => {
      return notif.key + notif.value;
    })
    .value();
  },
  handleChange(notifs){
    if (typeof this.props.onChange === 'function'){
      this.props.onChange(notifs);
    }
  },
  render(){
    return (
      <div>
        multi
        <NotificationSelection {...this.state} onChange={this.handleChange}/>
        {JSON.stringify(this.state.notifications)}
      </div>
    );
  }
});

export default MultiEdit;