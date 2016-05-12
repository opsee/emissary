import React, {PropTypes} from 'react';
import {Heading} from '../type';
import {Button} from '../forms';
import style from './onboard.css';

export default React.createClass({
  getInitialState(){
    return {
      submitted: false
    };
  },

  render(){
    return (
      <div className={style.transitionPanel}>
        <Heading level={1}>Hi Bart! Nice to meet you.</Heading>
        <p>Let's set a password for your account. (You'll use this password and your email address (bart@simpsons.com) to log into Opsee.)</p>

        <Button to="/s/account-created" block>Save password</Button>
      </div>
    );
  }
})