import React, {PropTypes} from 'react';
import _ from 'lodash';
import cx from 'classnames';

import {flag, stripe} from '../../modules';
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
      stripeToken: undefined,
      plan: _.chain(this.getPlans()).find({id: 'free'}).get('id').value(),
      valid: false
    };
  },
  componentDidMount(){
    this.handleChange();
  },
  getPlans(){
    return _.chain(['free', 'developer_monthly', 'team_monthly', 'beta'])
    .filter(d => {
      return flag(`team-plan-${d}`);
    })
    .map(id => {
      let label = _.capitalize(id);
      switch (id){
      case 'free':
        label = '<strong>Free</strong> <br/> Limited to 1 Check per month, no advanced features';
        break;
      case 'beta':
        label = '<strong>Team (Beta Pricing)</strong> <br/> $5 per check, per month (for 6 months) - all advanced features';
        break;
      case 'developer_monthly':
        label = '<strong>Developer</strong><br/> $5 per check, per month';
        break;
      case 'team_monthly':
        label = '<strong>Team</strong><br/> $10 per check, per month - plus team, historical data, and more advanced features';
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
      (state.plan === 'free' || state.stripeToken)
    ]
    const valid = _.every(validArr);
    const data = _.assign(state, {valid});
    this.setState(data);
    this.props.onChange(data);
  },
  handleCreditCardChange(stripeToken){
    this.setState({
      stripeToken
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
        <RadioSelect options={this.getPlans()} path="plan" data={this.state} onChange={this.handleChange} label="Plan*"/>
        {this.renderCreditCard()}
      </div>
    );
  }
});

export default PlanInputs;