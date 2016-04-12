import React, {PropTypes} from 'react';
import _ from 'lodash';
import style from './input.css';

const Input = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    /*
      providing a data object will allow the input field to reflect an
      entire source object back in the handleChange function
    */
    data: PropTypes.object,
    //path is a lodash .get() compatible string to the selected data
    path: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node
  },
  getInitialState() {
    return {
      id: `${this.props.path}-${_.uniqueId()}`
    };
  },
  getValue(){
    return _.get(this.props.data, this.props.path) || '';
  },
  getProps(){
    const props = _.assign({}, this.props, {
      onChange: this.handleChange,
      value: this.getValue(),
      className: style.input,
      id: this.state.id
    });
    return _.omit(props, ['data', 'children', 'label', 'path']);
  },
  handleChange(event){
    if (this.props.data){
      const data = _.chain(this.props.data)
      .cloneDeep()
      .set(this.props.path, event.target.value)
      .value();
      return this.props.onChange.call(null, data);
    }
    return event.target.value;
  },
  renderLabel(){
    if (this.props.label){
      return <label className={style.label} dangerouslySetInnerHTML={{__html: this.props.label}} htmlFor={this.state.id}/>;
    }
    return null;
  },
  render() {
    if (this.props.children){
      return (
        <div className={style.wrapper}>
          {this.renderLabel()}
          <input {...this.getProps()}/>
          <label htmlFor={this.state.id} className={style.iconLabel}>
            {this.props.children}
          </label>
        </div>
      );
    }
    return <input {...this.getProps()}/>;
  }
});

export default Input;