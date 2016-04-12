import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Padding} from '../layout';
import Radio from './Radio';

const RadioSelect = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    data: PropTypes.object,
    path: PropTypes.string.isRequired
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
  render(){
    return (
      <div>
        {this.props.options.map((w, i) => {
          return (
            <div key={i}>
              <Padding b={1}>
                <Radio on={_.get(this.props.data, this.props.path) === w.id} onChange={this.handleRadioChange} label={w.label || w.name || w.id} id={w.id}/>
              </Padding>
            </div>
          );
        })}
      </div>
    );
  }
});

export default RadioSelect;