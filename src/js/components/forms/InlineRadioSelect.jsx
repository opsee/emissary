import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import _ from 'lodash';
import colors from 'seedling/colors';

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
    return this.props.bf.form.updateData(obj, {
      clearValidation:false
    });
  },
  componentDidMount(){
    if(this.props.bf.field.initial && Array.isArray(this.props.bf.field.initial)){
      this.onChange(this.props.bf.field.initial[0], true);
    }
  },
  widgetIsActive(w){
    return _.findWhere(this.props.bf.value(), w.choiceValue);
  },
  render(){
    return(
      <div className="form-group">
        <label className="label">Method</label>
        <ul className="list-unstyled display-flex padding-sm">
          {this.props.bf.subWidgets().map((w, i) => {
            return (
              <li key={i} style={{marginRight:'1.8em'}}>
                <RadioWithLabel on={this.widgetIsActive(w) ? true : false} onChange={this.onChange} id={w.choiceValue} label={`${w.choiceLabel}`} labelStyle={{marginTop:'.4em',color:colors.textColor, paddingLeft:0}}/>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
});