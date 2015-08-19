import React from 'react';
import OpseeLabel from '../forms/OpseeLabel.jsx';
import OpseeToggle from '../forms/OpseeToggle.jsx';
import _ from 'lodash';

export default React.createClass({
  getInitialState(){
    return {
      data:this.props.bf.value()
    };
  },
  onChange(id){
    let data = this.props.bf.value() || [];
    if(_.findWhere(data, id)){
      data = _.pull(data, id);
    }else{
      data.push(id);
    }
    var obj = {};
    obj[this.props.bf.name] = data;
    this.props.bf.form.setData(obj);
  },
  widgetIsActive(w){
    return _.findWhere(this.props.bf.value(), w.choiceValue);
  },
  render(){
    return(
      <ul className="list-unstyled">
        {this.props.bf.subWidgets().map((w, i) => {
          return (
            <li className="display-flex flex-wrap padding-tb-sm" key={i}>
              <OpseeToggle on={this.widgetIsActive(w)} onChange={this.onChange} id={w.choiceValue}/>
              <div className="flex-1">
                <label onClick={this.onChange.bind(null, w.choiceValue)} className="user-select-none">{w.choiceValue} ({w.choiceLabel})</label>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
});