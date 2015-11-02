import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import colors from 'seedling/colors';
import {Padding} from '../layout';

export default React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  componentDidMount(){
    const val = this.props.bf.value();
    if (val){
      const obj = {};
      obj[this.props.bf.name] = val;
      this.props.bf.form.updateData(obj);
    }
    if (this.props.bf.field.initial && Array.isArray(this.props.bf.field.initial)){
      this.handleChange(this.props.bf.field.initial[0], true);
    }
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
  },
  isWidgetActive(w){
    return this.props.bf.value()[0] === w.choiceValue;
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
      <div className="form-group">
        <label className="label">Method</label>
        <Padding a={0.5}>
          <ul className="list-unstyled flex-wrap">
            {this.props.bf.subWidgets().map((w, i) => {
              return (
                <li key={i} style={{marginRight: '1.8em'}}>
                  <RadioWithLabel on={this.isWidgetActive(w) ? true : false} onChange={this.handleChange} id={w.choiceValue} label={`${w.choiceLabel}`} labelStyle={{marginTop: '.3em', color: colors.textColor, paddingLeft: 0}}/>
                </li>
              );
            })}
          </ul>
        </Padding>
      </div>
    );
  }
});