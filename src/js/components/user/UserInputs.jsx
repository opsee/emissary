import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField} from '../forms';

let include = [];

const InfoForm = forms.Form.extend({
  email: forms.CharField({
    widgetAttrs:{
      placeholder:'address@domain.com'
    }
  }),
  name: forms.CharField({
    widgetAttrs:{
      placeholder:'First Last'
    }
  }),
  password: forms.CharField({
    widget: forms.PasswordInput,
    widgetAttrs:{
      placeholder:'Your Password'
    }
  }),
  render() {
    return(
      <div>
      {
        include.map(field => {
          return <BoundField bf={this.boundField(field)} key={field}/>
        })
      }
      </div>
    )
  }
});

export default React.createClass({
  propTypes:{
    include:PropTypes.array.isRequired
  },
  componentWillMount(){
    include = this.props.include;
  },
  getInitialState() {
    var self = this;
    return {
      info:new InfoForm(_.extend({
        onChange(){
          self.props.onChange(self.state.info.cleanedData, this.isComplete());
          self.forceUpdate();
        },
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      },self.dataComplete()))
    }
  },
  dataComplete(){
    const test = _.chain(this.props.include).map(s => this.props[s]).every().value();
    if(test){
      return {
        data:this.props
      }
    }
  },
  render() {
    return (
      <div>
        {this.state.info.render()}
      </div>
    );
  }
});