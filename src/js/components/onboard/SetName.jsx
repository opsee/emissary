import React, {PropTypes} from 'react';
import {Heading} from '../type';
import {Button} from '../forms';
import style from './onboard.css';

export default React.createClass({
  render(){
    return (
      <div className={style.transitionPanel}>
        <Heading level={1}>Welcome to Opsee!</Heading>
        <p>What's your name?</p>

        <Button to="/s/password" block>Save name</Button>
      </div>
    );
  }
})