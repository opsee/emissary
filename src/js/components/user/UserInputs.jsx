import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';

function getState(){
  return {
    checks: Store.getChecks()
  }
}

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
    return {
      info:new InfoForm({
        onChange: this.forceUpdate.bind(this),
        labelSuffix:'',
        data:this.props
      })
    }
  },
  silence(id){
    Actions.silence(id);
  },
  handleClick() {
    this.setState({
      on:!this.state.on
    })
  },
  render() {
    return (
      <div>
        {this.state.info.render()}
      </div>
    );
  }
});