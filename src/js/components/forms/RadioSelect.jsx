import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import _ from 'lodash';

const RadioSelect = React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
  },
  isWidgetActive(w){
    return _.findWhere(this.props.bf.value(), w.choiceValue);
  },
  handleChange(id, bool){
    const data = bool ? [id] : [];
    let obj = {};
    obj[this.props.bf.name] = data;
    return this.props.bf.form.updateData(obj, {
      clearValidation: false
    });
  },
  render(){
    return (
      <ul className="list-unstyled">
        {this.props.bf.subWidgets().map((w, i) => {
          return (
            <li key={i}>
              <RadioWithLabel on={this.isWidgetActive(w) ? true : false} onChange={this.handleChange} id={w.choiceValue} label={`${w.choiceLabel}`}/>
            </li>
          );
        })}
      </ul>
    );
  }
});

export default RadioSelect;