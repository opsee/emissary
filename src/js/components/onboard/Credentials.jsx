import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler, Toolbar} from '../global';
import {Button} from '../forms';
import {Col, Grid, Padding, Row} from '../layout';
import {onboard as actions} from '../../actions';
import {Input} from '../forms';

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
      asyncActions: PropTypes.object
    }).isRequired
  },
  componentWillMount(){
    if (!this.props.redux.onboard.region && process.env.NODE_ENV !== 'debug'){
      this.props.history.replaceState(null, '/start/region-select');
    }
  },
  getStatus(){
    return this.props.redux.asyncActions.onboardVpcScan.status;
  },
  isDataComplete(){
    return this.props.redux.onboard.access_key && this.props.redux.onboard.secret_key;
  },
  isDisabled(){
    return !!(!this.isDataComplete() || this.getStatus() === 'pending');
  },
  handleInputChange(data){
    this.props.actions.setCredentials(data);
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.vpcScan(this.props.redux.onboard);
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
                  <Input data={this.props.redux.onboard} path="access_key" label="Access Key ID*" type="password" onChange={this.handleInputChange} placeholder="Your AWS Access Key ID"/>
                </Padding>
                <Padding b={1}>
                  <Input data={this.props.redux.onboard} path="secret_key" label="Secret Key*" type="password" onChange={this.handleInputChange} placeholder="Your AWS Secret Key"/>
                </Padding>

                <Padding b={2} className="text-secondary text-sm">
                  Note: At this time, manual installation of the instance through your AWS console is not possible.
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