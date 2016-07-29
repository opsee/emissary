import React, {PropTypes} from 'react';
import _ from 'lodash';
import cx from 'classnames';

import {stripe} from '../../modules';
import Input from './Input';
import {Alert, Padding} from '../layout';
import style from './creditCard.css';

const CreditCard = React.createClass({
  propTypes: {
    onChange: PropTypes.func
  },
  getInitialState() {
    return {
      number: undefined,
      cvc: undefined,
      exp_month: undefined,
      exp_year: undefined,
      valid: undefined,
      response: undefined,
      attempts: 0,
      debouncedTokenizer: _.debounce(this.runCreateToken, 500)
    };
  },
  runCreateToken(data, cb){
    this.setState({
      attempts: this.state.attempts + 1
    });
    stripe.card.createToken(data, cb);
  },
  handleChange(state){
    const data = _.pick(state, ['number', 'cvc', 'exp_month', 'exp_year']);
    if (_.every(data) || this.state.attempts > 0){
      this.state.debouncedTokenizer(data, (status, response) => {
        if (this.isMounted()){
          this.setState(_.assign({}, this.state, {
            status,
            response,
            valid: status === 200
          }));
          this.props.onChange({stripeToken: response && response.id});
        }
      });
    }
    this.setState(state);
  },
  renderAlert(){
    const message = _.get(this.state, 'response.error.message');
    if (message){
      return (
        <Padding t={1}>
          <Alert color="danger">{message}</Alert>
        </Padding>
      );
    }
    return null;
  },
  render(){
    return (
      <div className={cx(style.form, {[style.valid]: this.state.valid === true, [style.invalid]: this.state.valid === false})}>
        <Padding b={1}>
          <Input data={this.state} path="number" placeholder="Number" label="Credit Card Number*" onChange={this.handleChange}/>
        </Padding>
        <Padding b={1}>
          <Input data={this.state} path="cvc" placeholder="999" label="CVC*" onChange={this.handleChange}/>
        </Padding>
        <Padding className="display-flex" b={1}>
          <Padding r={1} className="flex-1">
            <Input data={this.state} path="exp_month" placeholder="10" label="Exp Month*" onChange={this.
          handleChange}/>
          </Padding>
          <div className="flex-1">
            <Input data={this.state} path="exp_year" placeholder="2019" label="Exp Year*" onChange={this.handleChange}/>
          </div>
        </Padding>
        {this.renderAlert()}
      </div>
    );
  }
});

export default CreditCard;