import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import colors from 'seedling/colors';

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
  isWidgetActive(w){
    return this.props.bf.value()[0] === w.choiceValue;
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
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
        <ul className="list-unstyled flex-wrap padding-sm">
          {this.props.bf.subWidgets().map((w, i) => {
            return (
              <li key={i} style={{marginRight: '1.8em'}}>
                <RadioWithLabel on={this.isWidgetActive(w) ? true : false} onChange={this.handleChange} id={w.choiceValue} label={`${w.choiceLabel}`} labelStyle={{marginTop: '.4em', color: colors.textColor, paddingLeft: 0}}/>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});