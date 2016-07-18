import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import cx from 'classnames';

import {Padding} from '../layout';
import Radio from './Radio';
import style from './radioSelect.css';
import inputStyle from './input.css';

const RadioSelect = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    data: PropTypes.object,
    path: PropTypes.string.isRequired,
    inline: PropTypes.bool,
    label: PropTypes.string,
    scheme: PropTypes.string
  },
  handleRadioChange(id){
    if (this.props.data){
      const data = _.chain(this.props.data)
      .cloneDeep()
      .set(this.props.path, id)
      .value();
      return this.props.onChange.call(null, data);
    }
    return this.props.onChange.call(null, id);
  },
  renderLabel(){
    if (this.props.label){
      return <div className={cx(inputStyle.label, inputStyle[this.props.scheme])} dangerouslySetInnerHTML={{__html: this.props.label}}/>;
    }
    return null;
  },
  render(){
    return (
      <div>
        {this.renderLabel()}
        <div className={this.props.inline ? style.wrapperInline : ''}>
          {this.props.options.map((w, i) => {
            return (
              <Padding b={1} key={i} className={this.props.inline ? style.itemInline : ''}>
                <Radio on={_.get(this.props.data, this.props.path) === w.id} onChange={this.handleRadioChange} label={w.label || w.name || w.id} id={w.id}/>
              </Padding>
            );
          })}
        </div>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(RadioSelect);