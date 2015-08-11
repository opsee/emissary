import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';

const InfoForm = forms.Form.extend({
  email: forms.CharField({
    widgetAttrs:{
      placeholder:'email'
    }
  }),
  name: forms.CharField({
    widgetAttrs:{
      placeholder:'name'
    }
  }),
  password: forms.CharField({
    widget: forms.PasswordInput,
    widgetAttrs:{
      placeholder:'password'
    }
  }),
  render() {
    return(
      <div>
      {
        this.data.include.map(field => {
          return <OpseeBoundField bf={this.boundField(field)}/>
        })
      }
      </div>
    )
  }
});

export default React.createClass({
  getInitialState() {
    var self = this;
    return {
      info:new InfoForm({
        onChange(){
          self.props.onChange(self.state.info.cleanedData);
          self.forceUpdate();
        },
        labelSuffix:'',
        data:this.props,
        onChangeDelay:100
      })
    }
  },
  // componentDidUpdate(){
  //   this.props.onChange(this.state.info.cleanedData);
  // },
  render() {
    return (
      <div>
        {this.state.info.render()}
      </div>
    );
  }
});