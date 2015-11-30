import React from 'react';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler, Toolbar} from '../global';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';
import {BoundField, Button} from '../forms';
import _ from 'lodash';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import config from '../../modules/config';
import {onboard as actions} from '../../reduxactions';

const InfoForm = forms.Form.extend({
  'access-key': forms.CharField({
    widget: forms.PasswordInput,
    label: 'Access Key ID',
    widgetAttrs: {
      placeholder: 'Your AWS Access Key ID'
    }
  }),
  'secret-key': forms.CharField({
    widget: forms.PasswordInput,
    label: 'Secret Key',
    widgetAttrs: {
      placeholder: 'Your AWS Secret Key'
    }
  })
});

const Credentials = React.createClass({
  componentWillMount(){
    if (!this.props.redux.onboard.region){
      this.props.history.replaceState(null, '/start/region-select');
    }
  },
  getInitialState() {
    const self = this;
    return {
      info: new InfoForm(_.extend({
        onChange(){
          OnboardActions.onboardSetCredentials(self.state.info.cleanedData);
          self.forceUpdate();
        },
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 100
        }
      }, self.isDataComplete() ? {data: this.props.redux.onboard.credentials} :  null))
    };
  },
  getStatus(){
    return this.props.redux.asyncActions.onboardVpcScan.status;
  },
  isDataComplete(){
    return _.chain(this.props.redux.onboard.credentials).values().every().value();
  },
  isDisabled(){
    return !this.state.info.isValid() || this.getStatus();
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.vpcScan(this.state.info.cleanedData);
  },
  render() {
    return (
       <div>
        <Toolbar title="AWS Credentials"/>
          <Grid>
            <Row>
              <Col xs={12}>
              <form onSubmit={this.handleSubmit}>
                <p>We need your AWS credentials to install the Bastion Instance. They will only be used once and <strong>we do not store them.</strong> If you  prefer, you can <a target="_blank" href="/docs/IAM">follow our IAM guide</a> and create a temporary role for Opsee to use during Bastion Instance installation. You can <a target="_blank" href="https://console.aws.amazon.com/iam/home#users">manage users and permissions</a> from your AWS console.</p>
                <Padding b={1}>
                  <BoundField bf={this.state.info.boundField('access-key')}/>
                </Padding>
                <Padding b={1}>
                  <BoundField bf={this.state.info.boundField('secret-key')}/>
                </Padding>

                <Padding b={2}>
                <p className="text-secondary text-sm">Note: At this time, manual installation of the Bastion Instance through your AWS console is not possible. You can learn more about the <a href="/docs/Cloudformation">Bastion Instance CloudFormation template</a> permissions and IAM role in our documentation.</p>
                </Padding>
                <StatusHandler status={this.getStatus()} timeout={1500}/>
                <Button color="success" type="submit" block disabled={this.isDisabled()} title={this.isDisabled() ? 'Fill in Credentials to move on.' : 'Install the Bastion Instance'} chevron>{this.getStatus() === 'pending' ? 'Submitting...' : 'Next'}</Button>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Credentials);