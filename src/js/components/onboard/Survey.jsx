import React, {PropTypes} from 'react';
import {OnboardActions, UserActions} from '../../actions';
import {OnboardStore, UserStore} from '../../stores';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField, Button} from '../forms';
import _ from 'lodash';
import {Grid, Row, Col} from '../../modules/bootstrap';
import colors from 'seedling/colors';
import config from '../../modules/config';

const serviceChoices = ['Cassandra', 'Consul', 'Docker Registry', 'Elasticsearch', 'Etcd', 'Influxdb', 'Memcached', 'MongoDB', 'MySQL', 'Node', 'Postgres', 'RDS', 'Redis', 'Riak', 'Zookeeper']

const featureChoices = ['AWS Integration', 'Simpler Monitoring', 'No Software', 'Actions, like restarts'];

const sucksChoices = ['Hard to maintain', 'Too Complicated', 'Requires Config Management', 'Bad UI'];

const InfoForm = forms.Form.extend({
  services: forms.MultipleChoiceField({
    choices:serviceChoices.map(s => [s, s]),
    widget: forms.CheckboxSelectMultiple(),
    label:'buttonToggle'
  }),
  features: forms.MultipleChoiceField({
    choices:featureChoices.map(s => [s, s]),
    widget: forms.CheckboxSelectMultiple(),
    label:'buttonToggle'
  }),
  sucks: forms.MultipleChoiceField({
    choices:sucksChoices.map(s => [s, s]),
    widget: forms.CheckboxSelectMultiple(),
    label:'buttonToggle'
  }),
});

const Survey = React.createClass({
  mixins: [OnboardStore.mixin],
  storeDidChange(){
  },
  getInitialState() {
    var self = this;
    return {
      info:new InfoForm({
        onChange(){
          self.dataHasChanged();
          self.forceUpdate();
        },
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      }),
      step:0
    }
  },
  componentWillMount(){
    UserActions.userGetUserData(UserStore.getUser().toJS());
  },
  dataHasChanged(){
    UserActions.userPutUserData('bastionInstallSurvey', this.state.info.cleanedData);
  },
  dataComplete(){
    return false;
    // return _.chain(OnboardStore.getInstallData()).values().every(_.identity).value();
  },
  disabled(){
    return !this.state.info.isValid();
  },
  getSteps(){
    return [
    (
      <div>
        <h3>Which services are you using?</h3>
        <BoundField bf={this.state.info.boundField('services')}/>
      </div>
    ),
    (
      <div>
        <h3>What are you looking forward to most in Opsee?</h3>
        <BoundField bf={this.state.info.boundField('features')}/>
      </div>
    ),
    (
      <div>
        <h3>What do you hate about monitoring today?</h3>
        <BoundField bf={this.state.info.boundField('sucks')}/>
      </div>
    ),
    (
      <div>
        <h3>Thanks for the feedback!</h3>
      </div>
    )
    ]
  },
  next(){
    this.setState({
      step:this.state.step+1
    })
  },
  renderButton(){
    if(this.state.step != (this.getSteps().length - 1)){
      return (
        <Button color="info" block={true} className="pull-right" onClick={this.next}>Next</Button>
      )
    }else{
      return <div/>
    }
  },
  render() {
    return (
      <form>
        {this.getSteps()[this.state.step]}
        {this.renderButton()}
      </form>
    );
  }
});

export default Survey;