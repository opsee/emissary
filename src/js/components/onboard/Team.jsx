import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';
import OnboardStore from '../../stores/Onboard';
import OnboardActions from '../../actions/Onboard';
import UserStore from '../../stores/User';
import {State} from 'react-router';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';

const InfoForm = forms.Form.extend({
  name: forms.CharField({
    widgetAttrs:{
      placeholder:'Initech'
    }
  }),
  domain: forms.CharField({
    widgetAttrs:{
      placeholder:'initech[.opsee.co]'
    }
  })
});

export default React.createClass({
  mixins: [State],
  storeDidChange(){
    const status = OnboardStore.getSetPasswordStatus();
    this.setState({status})
    if(status == 'success'){
      router.transitionTo('onboardThanks');
    }
  },
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
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      })
    }
  },
  updateUserData(data){
    this.setState({password:data.password})
  },
  submit(e){
    e.preventDefault();
    this.setState({
      submitting:true
    });
    OnboardActions.setPassword(this.state);
  },
  disabled(){
    return !this.state.password || this.state.status == 'pending';
  },
  btnText(){
    return this.state.status == 'pending' ? 'Setting...' : 'Set';
  },
  render() {
    console.log(this.state);
    return (
       <div>
        <Toolbar title="Create Your Team"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <OpseeBoundField bf={this.state.info.boundField('name')}/>
                <div className="text-sm text-secondary">
                  <em>This name will appear in headings and menus to identify your team. Your company name is probably a good choice, but it doesn&rsquo;t need to be official or anything.</em>
                </div>
                <div><br/></div>
                <OpseeBoundField bf={this.state.info.boundField('domain')}/>
                <div className="text-sm text-secondary">
                  <em>The web address you'll use to access your team's account. Keep it short and memorable. Only lowercase letters, numbers, and dashes are allowed, and it must start with a letter.</em>
                </div>
                <div><br/></div>
                <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
                  <span>
                    {this.btnText()}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
