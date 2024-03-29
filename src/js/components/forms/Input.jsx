import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';

import style from './input.css';

const Input = React.createClass({
  propTypes: {
    className: PropTypes.string, // for the input
    onChange: PropTypes.func.isRequired,
    /*
      providing a data object will allow the input field to reflect an
      entire source object back in the handleChange function
    */
    data: PropTypes.object,
    //path is a lodash .get() compatible string to the selected data
    path: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node,
    textarea: PropTypes.bool,
    id: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    scheme: PropTypes.string
  },
  getInitialState() {
    return {
      id: this.props.id || `${this.props.path}-${_.uniqueId()}`
    };
  },
  getDefaultProps() {
    return {
      autoComplete: 'new-password',
      autoCorrect: 'off'
    };
  },
  getValue(){
    return _.get(this.props.data, this.props.path) || '';
  },
  getProps(){
    const props = _.assign({}, this.props, {
      onChange: this.handleChange,
      value: this.getValue(),
      className: cx(style.input, style[this.props.scheme], this.props.className),
      id: this.state.id
    });
    return _.omit(props, ['data', 'children', 'label', 'path', 'scheme', 'dispatch']);
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
      return <label className={cx(style.label, style[this.props.scheme])} dangerouslySetInnerHTML={{__html: this.props.label}} htmlFor={this.state.id}/>;
    }
    return null;
  },
  renderChildren(){
    if (this.props.children){
      return (
        <label htmlFor={this.state.id} className={cx(style.iconLabel, style[this.props.scheme])}>
          {this.props.children}
        </label>
      );
    }
    return null;
  },
  renderItem(){
    if (this.props.textarea){
      return <textarea {...this.getProps()}/>;
    }
    return <input {...this.getProps()}/>;
  },
  render() {
    return (
      <div className={cx(style.wrapper, style[this.props.scheme])}>
        {this.renderLabel()}
        {this.renderItem()}
        {this.renderChildren()}
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Input);