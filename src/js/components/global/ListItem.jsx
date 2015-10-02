import React from 'react';
import moment from 'moment';
import Radium from 'radium';
import colors from 'seedling/colors';
import _ from 'lodash';

const ListItem = React.createClass({
  getStyle(){
    return {
      overflow:'hidden'
    }
  },
  render() {
    return (
      <div style={this.getStyle()} className="flex-1 link-style-1 align-items-center">
        {this.props.children}
      </div>
    );
  }
});

export default Radium(ListItem);