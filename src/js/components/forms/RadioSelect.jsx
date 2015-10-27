import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import _ from 'lodash';

export default React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
  },
  onChange(id, bool){
    const data = bool ? [id] : [];
    let obj = {};
    obj[this.props.bf.name] = data;
    return this.props.bf.form.updateData(obj, {
      clearValidation: false
    });
  },
  isWidgetActive(w){
    return _.findWhere(this.props.bf.value(), w.choiceValue);
  },
  render(){
    return (
      <ul className="list-unstyled">
        {this.props.bf.subWidgets().map((w, i) => {
          return (
            <li key={i}>
              <RadioWithLabel on={this.isWidgetActive(w) ? true : false} onChange={this.onChange} id={w.choiceValue} label={`${w.choiceLabel}`}/>
            </li>
          );
        })}
      </ul>
    );
  }
});