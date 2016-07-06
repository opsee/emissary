import React, {PropTypes} from 'react';
import _ from 'lodash';
import cx from 'classnames';

import {stripe} from '../../modules';
import Input from './Input';
import CreditCard from './CreditCard';
import RadioSelect from './RadioSelect';
import {Alert, Padding} from '../layout';
import style from './creditCard.css';

const PlanInputs = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      token: undefined,
      plan: _.chain(this.getPlans()).find({id: 'free'}).get('id').value(),
      valid: false
    };
  },
  componentDidMount(){
    this.handleChange();
  },
  getPlans(){
    return _.chain(['developer', 'free', 'beta', 'advanced'])
    .reject(d => d.match('developer|advanced'))
    .map(id => {
      let label = _.capitalize(id);
      switch (id){
      case 'free':
        label = 'Free <br/> Limited to 1 Check per month, no advanced features';
        break;
      case 'beta':
        label = 'Advanced (Beta Pricing) <br/> $5 per check, per month - all advanced features';
        break;
      default:
        break;
      }
      return {id, label};
    })
    .value();
  },
  runChange(){
    this.props.onChange(this.state);
  },
  handleChange(state = this.state){
    const validArr = [
      (state.plan === 'free' || state.token)
    ]
    const valid = _.every(validArr);
    const data = _.assign(state, {valid});
    this.setState(data);
    this.props.onChange(data);
  },
  handleCreditCardChange(token){
    this.setState({
      token
    });
  },
  renderCreditCard(){
    if (this.state.plan !== 'free'){
      return (
        <Padding t={1}>
          <CreditCard onChange={this.handleChange}/>
        </Padding>
      );
    }
    return null;
  },
  render(){
    return (
      <div>
        <RadioSelect options={this.getPlans()} path="plan" data={this.state} onChange={this.handleChange} label="Plan"/>
        {this.renderCreditCard()}
      </div>
    );
  }
});

export default PlanInputs;