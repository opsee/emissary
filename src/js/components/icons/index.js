import React from 'react';
import Icon from './Icon';
import _ from 'lodash';
import paths from './paths';

export default _.mapValues(paths, (string, name) => {
  return React.createClass({
    displayName: name,
    render(){
      return <Icon path={string} {...this.props}/>;
    }
  });
});