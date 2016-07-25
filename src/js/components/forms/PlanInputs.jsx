import React, {PropTypes} from 'react';
import _ from 'lodash';

import {flag} from '../../modules';
import CreditCard from './CreditCard';
import RadioSelect from './RadioSelect';
import {Padding} from '../layout';
import {Button} from '../forms';
import {Heading} from '../type';

const PlanInputs = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string
  },
  getInitialState() {
    return {
      stripeToken: undefined,
      subscription_plan: this.props.selected,
      valid: false,
      showCC: false
    };
  },
  componentDidMount(){
    this.handleChange();
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected && this.state.subscription_plan !== nextProps.selected){
      this.setState({
        subscription_plan: nextProps.selected
      });
    }
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
      (state.subscription_plan === 'free' || state.stripeToken)
    ];
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
  handleShowCC(){
    this.setState({
      showCC: true
    });
  },
  renderCreditCard(){
    if (this.state.subscription_status === 'active'){
      return (
        <Padding t={1}>
          <Button flat color="primary" onClick={this.handleShowCC}>Update Credit Card</Button>
        </Padding>
      );
    }
    return (
      <Padding t={1}>
        <CreditCard onChange={this.handleChange}/>
      </Padding>
    );
  },
  render(){
    return (
      <Padding t={1}>
        <Heading level={3}>Plan and Billing</Heading>
        <RadioSelect options={this.getPlans()} path="subscription_plan" data={this.state} onChange={this.handleChange} label="Plan*"/>
        {this.renderCreditCard()}
      </Padding>
    );
  }
});

export default PlanInputs;