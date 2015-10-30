import React, {PropTypes} from 'react';
import _ from 'lodash';

import MultiToggle from './MultiToggle.jsx';
import InputWithLabel from './InputWithLabel.jsx';
import DeleteFormButton from './DeleteFormButton.jsx';
import Dropdown from './Dropdown.jsx';
import RadioSelect from './RadioSelect.jsx';
import MultiButtonToggle from './MultiButtonToggle.jsx';
import InlineRadioSelect from './InlineRadioSelect.jsx';

export default React.createClass({
  propTypes: {
    bf: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string
  },
  renderFallback(){
    return (
    <div className="form-group">
      <InputWithLabel bf={this.props.bf}>
        {this.props.children}
      </InputWithLabel>
    </div>
    );
  },
  renderInner(){
    switch (this.props.bf.field.constructor.name){
    case 'ChoiceField':
      const type = _.get(this.props.bf, 'field.widget.attrs.widgetType');
      if (type === 'InlineRadioSelect'){
        return <InlineRadioSelect bf={this.props.bf}/>;
      }else if (type === 'RadioSelect'){
        return <RadioSelect bf={this.props.bf}/>;
      }
      return (
        <div className="form-group">
          <Dropdown bf={this.props.bf}/>
        </div>
      );
    case 'BooleanField':
      if (this.props.bf.field.label === 'Delete'){
        return <DeleteFormButton bf={this.props.bf}/>;
      }
      return this.renderFallback();
    case 'MultipleChoiceField':
      if (this.props.bf.field.label === 'buttonToggle'){
        return <MultiButtonToggle bf={this.props.bf}/>;
      }
      return <MultiToggle bf={this.props.bf}/>;
    default:
      return this.renderFallback();
    }
  },
  render(){
    return (
      <div className={this.props.className}>
        {this.renderInner()}
      </div>
    );
  }
});