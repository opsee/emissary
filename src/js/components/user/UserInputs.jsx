import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Mail, Person, Lock} from '../icons';
import {Padding} from '../layout';
import Input from '../forms2/Input';

const UserInputs = React.createClass({
  propTypes: {
    include: PropTypes.array.isRequired,
    data: PropTypes.object,
    onChange: PropTypes.func.isRequired
  },
  renderEmail(){
    return (
      <Input data={this.props.data} path="email" placeholder="address@domain.com" autoCapitalize="off" autoCorrect="off" onChange={this.props.onChange} label="Email">
        <Mail/>
      </Input>
    );
  },
  renderPassword(){
    return (
      <Input data={this.props.data} type="password" path="password" placeholder="Password" onChange={this.props.onChange} label="Password">
        <Lock/>
      </Input>
    );
  },
  renderName(){
    return (
      <Input data={this.props.data} path="name" placeholder="Your Name" onChange={this.props.onChange} label="Name">
        <Person/>
      </Input>
    );
  },
  render() {
    return (
      <div>
        {this.props.include.map((key, i) => {
          return (
            <Padding b={1} key={`user-inputs-padding-${i}`}>
              {this[`render${_.capitalize(key)}`]()}
            </Padding>
          );
        })}
      </div>
    );
  }
});

export default UserInputs;