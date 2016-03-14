import React, {PropTypes} from 'react';
import style from './rule.css';

const Rule = React.createClass({
  propTypes: {
    sm: PropTypes.bool
  },
  render(){
    return <div className={style.rule}/>;
  }
});

export default Rule;