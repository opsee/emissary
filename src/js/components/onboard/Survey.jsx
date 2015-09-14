import React, {PropTypes} from 'react';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField, Button} from '../forms';
import _ from 'lodash';
import {Grid, Row, Col} from '../../modules/bootstrap';
import colors from 'seedling/colors';

const serviceChoices = ["Cassandra", "Consul", "Docker Registry", "Elasticsearch", "Etcd", "Influxdb", "Memcached", "MongoDB", "MySQL", "Node", "Postgres", "RDS", "Redis", "Riak", "Zookeeper"]

const InfoForm = forms.Form.extend({
  services: forms.MultipleChoiceField({
    choices:serviceChoices.map(s => [s, s]),
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
    var data = OnboardStore.getInstallData();
    return {
      info:new InfoForm(_.extend({
        onChange(){
          // OnboardActions.onboardSetSurvey(self.state.info.cleanedData);
          self.forceUpdate();
        },
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      }, self.dataComplete() ? {data:data} :  null))
    }
  },
  dataComplete(){
    return false;
    // return _.chain(OnboardStore.getInstallData()).values().every(_.identity).value();
  },
  disabled(){
    return !this.state.info.isValid();
  },
  render() {
    return (
      <form>
        <h2>Which services are you using?</h2>
        <BoundField bf={this.state.info.boundField('services')}/>
      </form>
    );
  }
});

export default Survey;