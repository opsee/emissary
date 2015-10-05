import React, {Children} from 'react';
import moment from 'moment';
import Radium from 'radium';
import colors from 'seedling/colors';
import _ from 'lodash';

const ListItem = React.createClass({
  getStyle(){
    const local = [{
      overflow:'hidden',
      transition:'300ms background',
      // ':hover':{
      //   background:colors.gray700
      // }
    }]
    const style = this.props.style || [];
    return style.concat(local);
  },
  children(){
    const self = this;
    return Children.map(this.props.children, c => {
      c.props.hovered = Radium.getState(self.state, null, ':hover');
      c.props.foo = 'true';
      return c;
    })
  },
  render() {
    return (
      <div className="flex-1 link-style-1 align-items-center list-item" style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
});

export default Radium(ListItem);