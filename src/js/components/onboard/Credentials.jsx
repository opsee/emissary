import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField, Button} from '../forms';
import _ from 'lodash';
import router from '../../modules/router.js';
import {Grid, Row, Col} from '../../modules/bootstrap';
import colors from 'seedling/colors';

const InfoForm = forms.Form.extend({
  'access-key': forms.CharField({
    widget: forms.PasswordInput,
    label:'Access Key ID',
    widgetAttrs:{
      placeholder:'Your AWS Access Key ID',
    }
  }),
  'secret-key': forms.CharField({
    widget: forms.PasswordInput,
    label:'Secret Key',
    widgetAttrs:{
      placeholder:'Your AWS Secret Key',
    }
  }),
});

const Credentials = React.createClass({
  mixins: [OnboardStore.mixin],
  statics:{
    willTransitionTo(transition, params, query){
      const data = OnboardStore.getInstallData();
      if(!data.regions.length){
        transition.redirect('onboardRegionSelect');
      }
    }
  },
  storeDidChange(){
    const regionsWithVpcs = OnboardStore.getAvailableVpcs();
    let vpcs = _.chain(regionsWithVpcs).map(r => {
      return r.vpcs.map(v => {
        return v['vpc-id']
      });
    }).flatten().value();
    if(vpcs.length){
      if(false){
      // if(vpcs.length === 1){
        OnboardActions.onboardSetVpcs(vpcs);
        router.transitionTo('onboardInstall');
      }else{
        router.transitionTo('onboardVpcSelect');
      }
    }
  },
  getInitialState() {
    var self = this;
    var data = OnboardStore.getInstallData();
    return {
      info:new InfoForm(_.extend({
        onChange(){
          OnboardActions.onboardSetCredentials(self.state.info.cleanedData);
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
    return _.chain(OnboardStore.getInstallData()).values().every(_.identity).value();
  },
  submit(e){
    e.preventDefault();
    OnboardActions.onboardSetCredentials(this.state.info.cleanedData);
    OnboardActions.onboardVpcScan(OnboardStore.getInstallData());
    // router.transitionTo('onboardVpcSelect')
  },
  disabled(){
    return !this.state.info.isValid();
  },
  render() {
    return (
       <div>
        <Toolbar title="AWS Credentials"/>
          <Grid>
            <Row>
              <Col xs={12} sm={10} smOffset={1}>
              <form onSubmit={this.submit}>
                <p>We need your AWS credentials to install the Bastion Instance. They will only be used once and <strong>we do not store them.</strong> You can <a href="https://console.aws.amazon.com/iam/home#users">manage users and permissions</a> from your AWS console.</p>
                <div><br/></div>
                <BoundField bf={this.state.info.boundField('access-key')}/>
                <BoundField bf={this.state.info.boundField('secret-key')}/>

                <p className="text-serif text-secondary text-sm padding-bx2">Note: At this time, manual installation of the Bastion Instance through your AWS console is not possible. You can learn more about the <a href="/docs/Cloudformation">Bastion Instance CloudFormation template</a> permissions and IAM role in our documentation.</p>

                <Button bsStyle="success" type="submit" block={true} disabled={this.disabled()} title={this.disabled() ? 'Fill in Credentials to move on.' : 'Install the Bastion Instance'} chevron={true}>Next</Button>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Credentials;