import React, {PropTypes} from 'react';

import {Mail} from '../icons';

export default React.createClass({
  propTypes: {
    notifications: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string.isRequired
    })).isRequired
  },
  render() {
    return (
      <div className="list-unstyled">
        {this.props.notifications.map((notification, i) => {
          return (
            <li key={`notif-${i}`}>
              <Mail file="text" inline/> {notification.value}
            </li>
          );
        })}
      </div>
    );
  }
});