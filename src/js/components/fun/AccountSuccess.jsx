import React, {PropTypes} from 'react';
import {History} from 'react-router';

import {Heading} from '../type';
import {Button} from '../forms';
import style from './onboard.css';

export default React.createClass({
  componentDidMount(){
    setTimeout(() => {
      this.props.history.pushState(null, '/s');
    }, 2000)
  },
  render(){
    return (
      <div className={style.transitionPanel}>
        <Heading level={1}>Great, you're all set up!</Heading>
      </div>
    );
  }
})