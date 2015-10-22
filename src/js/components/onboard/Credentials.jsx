import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField, Button} from '../forms';
import _ from 'lodash';
import router from '../../modules/router';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import colors from 'seedling/colors';
import config from '../../modules/config';
import storage from '../../modules/storage';
import {Padding} from '../layout';

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
    const vpcScanStatus = OnboardStore.getOnboardVpcScanStatus();
    if(vpcScanStatus == 'success'){
      const regionsWithVpcs = OnboardStore.getAvailableVpcs();
      let vpcs = _.chain(regionsWithVpcs).map(r => {
        return r.vpcs.map(v => {
          return v['vpc-id']
        });
      }).flatten().value();
      if(vpcs.length){
        if(vpcs.length === 1 && !storage.get('showVpcsOnboard')){
          OnboardActions.onboardSetVpcs(vpcs);
          router.transitionTo('onboardInstall');
        }else{
          router.transitionTo('onboardVpcSelect');
        }
      }
    }else if(vpcScanStatus && vpcScanStatus != 'pending'){
      if(config.demo){
        return router.transitionTo('onboardInstall');
      }
      this.setState({
        error:vpcScanStatus && vpcScanStatus.body && vpcScanStatus.body.error
      })
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
    this.setState({
      error:null
    });
    OnboardActions.onboardSetCredentials(this.state.info.cleanedData);
    OnboardActions.onboardVpcScan(OnboardStore.getVpcScanData());
    // router.transitionTo('onboardVpcSelect')
  },
  disabled(){
    return !this.state.info.isValid();
  },
  renderError(){
    if(this.state.error){
      return (
        <div>
          <div><br/></div>
          <Alert type="danger">
            {this.state.error}
          </Alert>
        </div>
      )
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="AWS Credentials"/>
          <Grid>
            <Row>
              <Col xs={12}>
              <form onSubmit={this.submit}>
                <p>We need your AWS credentials to install the Bastion Instance. They will only be used once and <strong>we do not store them.</strong> If you  prefer, you can <a href="/docs/IAM">follow our IAM guide</a> and create a temporary role for Opsee to use during Bastion Instance installation. You can <a href="https://console.aws.amazon.com/iam/home#users">manage users and permissions</a> from your AWS console.</p>
                <Padding b={1}>
                  <BoundField bf={this.state.info.boundField('access-key')}/>
                </Padding>
                <Padding b={1}>
                  <BoundField bf={this.state.info.boundField('secret-key')}/>
                </Padding>

                <Padding b={2}>
                <p className="text-secondary text-sm">Note: At this time, manual installation of the Bastion Instance through your AWS console is not possible. You can learn more about the <a href="/docs/Cloudformation">Bastion Instance CloudFormation template</a> permissions and IAM role in our documentation.</p>
                </Padding>

                <Button bsStyle="success" type="submit" block={true} disabled={this.disabled()} title={this.disabled() ? 'Fill in Credentials to move on.' : 'Install the Bastion Instance'} chevron={true}>Next</Button>
              </form>
              {this.renderError()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Credentials;