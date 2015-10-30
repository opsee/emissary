import React, {PropTypes} from 'react';
import ButtonToggle from './ButtonToggle.jsx';
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
  isWidgetActive(w){
    return _.findWhere(this.props.bf.value(), w.choiceValue);
  },
  handleChange(id){
    let data = this.props.bf.value() || [];
    let obj = {};
    if (_.findWhere(data, id)){
      data = _.pull(data, id);
    }else {
      data.push(id);
    }
    obj[this.props.bf.name] = data;
    const combined = _.assign({}, this.props.bf.form.cleanedData, obj);
    this.props.bf.form.setData(combined);
  },
  render(){
    return (
      <ul className="list-unstyled flex-wrap flex-vertical-align justify-content-center">
        {this.props.bf.subWidgets().map((w, i) => {
          return (
            <li className="padding-tb-sm" key={i} style={{margin: '0 .5em'}}>
              <ButtonToggle on={this.isWidgetActive(w) ? true : false} onChange={this.handleChange} id={w.choiceValue} label={`${w.choiceLabel}`}/>
            </li>
          );
        })}
      </ul>
    );
  }
});