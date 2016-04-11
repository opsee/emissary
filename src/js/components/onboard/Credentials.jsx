import React, {PropTypes} from 'react';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Toolbar} from '../global';
import {BoundField, Button} from '../forms';
import {Col, Grid, Padding, Row} from '../layout';
import {onboard as actions} from '../../actions';

const InfoForm = forms.Form.extend({
  'access_key': forms.CharField({
    widget: forms.PasswordInput,
    label: 'Access Key ID',
    widgetAttrs: {
      placeholder: 'Your AWS Access Key ID'
    }
  }),
  'secret_key': forms.CharField({
    widget: forms.PasswordInput,
    label: 'Secret Key',
    widgetAttrs: {
      placeholder: 'Your AWS Secret Key'
    }
  })
});

const Credentials = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setCredentials: PropTypes.func,
      vpcScan: PropTypes.func
    }),
    history: PropTypes.object,
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        region: PropTypes.string,
        'access_key': PropTypes.string,
        'secret_key': PropTypes.string
      }),
      app: PropTypes.shape({
        socketMessages: PropTypes.array
      }),
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      asyncActions: PropTypes.object
    }).isRequired
  },
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
          self.props.actions.setCredentials(self.state.info.cleanedData);
          self.forceUpdate();
        },
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 100
        }
      }, self.isDataComplete() ? {data: this.props.redux.onboard} :  null))
    };
  },
  getStatus(){
    return this.props.redux.asyncActions.onboardVpcScan.status;
  },
  isDataComplete(){
    return this.props.redux.onboard.access_key && this.props.redux.onboard.secret_key;
  },
  isDisabled(){
    return !!(!this.state.info.isComplete() || this.getStatus() === 'pending');
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
                <p>We need your AWS credentials to install the our instance. They will only be used once and <strong>we do not store them.</strong> If you  prefer, you can <a target="_blank" href="/docs/IAM">follow our IAM guide</a> and create a temporary role for Opsee to use during instance installation. You can <a target="_blank" href="https://console.aws.amazon.com/iam/home#users">manage users and permissions</a> from your AWS console.</p>
                <Padding b={1}>
                  <BoundField bf={this.state.info.boundField('access_key')}/>
                </Padding>
                <Padding b={1}>
                  <BoundField bf={this.state.info.boundField('secret_key')}/>
                </Padding>

                <Padding b={2}>
                <p className="text-secondary text-sm">Note: At this time, manual installation of the instance through your AWS console is not possible.</p>
                </Padding>
                <StatusHandler status={this.getStatus()} timeout={1500}/>
                <Button color="success" type="submit" block disabled={this.isDisabled()} title={this.isDisabled() ? 'Fill in Credentials to move on.' : 'Install the Opsee Instance'} chevron>{this.getStatus() === 'pending' ? 'Submitting...' : 'Next'}</Button>
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