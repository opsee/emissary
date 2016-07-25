import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Mail, Person, Lock} from '../icons';
import {Padding} from '../layout';
import {Input} from '../forms';

const UserInputs = React.createClass({
  propTypes: {
    include: PropTypes.array.isRequired,
    data: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.array,
    autoFocus: PropTypes.oneOf(['email', 'password', 'name']),
    //props to input
    password: PropTypes.object,
    //props to input
    email: PropTypes.object,
    //props to input
    name: PropTypes.object
  },
  getDefaultProps() {
    return {
      required: ['email', 'password', 'name']
    };
  },
  getLabel(type){
    const found = this.props.required.indexOf(type) > -1;
    const suffix = found ? '*' : '';
    return _.capitalize(type) + suffix;
  },
  renderEmail(){
    return (
      <Input data={this.props.data} path="email" placeholder="address@domain.com" autoCapitalize="off" autoCorrect="off" onChange={this.props.onChange} label={this.getLabel('email')} autoFocus={this.props.autoFocus === 'email'}>
        <Mail/>
      </Input>
    );
  },
  renderPassword(){
    const props = _.assign({
      data: this.props.data,
      type: 'password',
      path: 'password',
      placeholder: 'Password',
      label: this.getLabel('password'),
      autoFocus: this.props.autoFocus === 'password'
    }, this.props.password);
    return (
      <Input onChange={this.props.onChange} {...props}>
        <Lock/>
      </Input>
    );
  },
  renderName(){
    return (
      <Input data={this.props.data} path="name" placeholder="Your Name" onChange={this.props.onChange} label={this.getLabel('name')} autoFocus={this.props.autoFocus === 'name'}>
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