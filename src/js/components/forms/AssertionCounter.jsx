import React from 'react';
import _ from 'lodash';
import slate from 'slate';
import {Close, Checkmark} from '../icons';
import colors from 'seedling/colors';
import Radium from 'radium';
import style from './assertionCounter.css';
console.log(style);

const AssertionCounter = React.createClass({
  getInitialState(){
    return this.props;
  },
  getField(fieldName){
    const field = _.find(this.state.fields, field => field.name == fieldName);
    if(field){
      return field.value();
    }else{
      return false;
    }
  },
  setAssertionPassing(){
    /* 
      this.state.fields should be an array of BoundFields
    */
    const assertion = {
      key:this.getField('key'),
      relationship:this.getField('relationship'),
      operand:this.getField('operand'),
      value:this.getField('value')
    }
    var test = slate(assertion, this.state.response);
    this.setState({
      passing:test && test.success,
      error:!test || test.error
    });
  },
  componentWillReceiveProps(){
    this.setAssertionPassing();
  },
  hasRelationship(){
    return _.find(this.state.fields, field => field.name == 'relationship').value()
  },
  isActive(){
    return this.hasRelationship() ? 'active' : '';
  },
  getTitle(){
    return this.state.passing ? 'Assertion is currently passing.' : 'Assertion is currently failing.'
  },
  getSmallIcon(){
    return this.state.passing ? (
      <Checkmark className={style.iconSuccess}/>
    ) : (
      <Close className={style.iconDanger}/>
    )
  },
  render(){
    return(
      <div title={this.getTitle()} className={this.state.passing ? style.counterSuccess : style.counterDanger}>
      {this.props.label+1}
      <div className={`${style.validation} ${this.hasRelationship() ? style.validationActive : ''}`}>
      {this.getSmallIcon()}
      </div>
    </div>
    )
  }
});

export default Radium(AssertionCounter);