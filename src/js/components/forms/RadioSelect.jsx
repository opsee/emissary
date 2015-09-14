import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import _ from 'lodash';

export default React.createClass({
  propTypes:{
    bf:PropTypes.object.isRequired
  },
  getInitialState(){
    return {
      data:this.props.bf.value()
    };
  },
  onChange(id, bool){
    const data = bool ? [id] : [];
    var obj = {};
    obj[this.props.bf.name] = data;
    return this.props.bf.form.setData(obj);
  },
  widgetIsActive(w){
    return _.findWhere(this.props.bf.value(), w.choiceValue);
  },
  render(){
    return(
      <ul className="list-unstyled">
        {this.props.bf.subWidgets().map((w, i) => {
          return (
            <li key={i}>
              <RadioWithLabel on={this.widgetIsActive(w) ? true : false} onChange={this.onChange} id={w.choiceValue} label={`${w.choiceLabel}`}/>
            </li>
          )
        })}
      </ul>
    )
  }
});