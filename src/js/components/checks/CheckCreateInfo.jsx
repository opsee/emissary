import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BastionRequirement, Toolbar} from '../global';
import {Button} from '../forms';
import {Close} from '../icons';
import {StatusHandler} from '../global';
import {UserDataRequirement} from '../user';
import {Heading} from '../type';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import NotificationSelection from './NotificationSelection';
import CheckDisabledReason from './CheckDisabledReason';
import {validate} from '../../modules';
import {Input} from '../forms';
import {
  checks as actions,
  user as userActions,
  analytics as analyticsActions
} from '../../actions';

const CheckCreateInfo = React.createClass({
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool,
    onSubmit: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func
    }),
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
    }),
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        checkCreate: PropTypes.object
      })
    })
  },
  componentWillMount(){
    if (!this.props.check.assertions.length || !this.props.check.target.id){
      if (process.env.NODE_ENV !== 'debug' && !this.props.renderAsInclude){
        this.props.history.push('/check-create/target');
      }
    }
    //mostly for setting the name of the check at this point
    this.runChange();
  },
  getGeneratedName(){
    const {target} = this.props.check;
    const prefix = target.type === 'rds' ? 'Cloudwatch' : 'Http';
    if (this.props.check.name){
      return this.props.check.name;
    } else if (target.name || target.id){
      const string = target.name || target.id;
      return `${prefix} ${string}`;
    }
    return '${prefix} check';
  },
  getFinalData(){
    let check = _.cloneDeep(this.props.check);
    check.name = this.getGeneratedName();
    return check;
  },
  isDisabled(){
    return !!validate.check(this.props.check).length || this.props.redux.asyncActions.checkCreate.status === 'pending';
  },
  runChange(){
    this.props.onChange(this.getFinalData());
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckInfoHelp');
  },
  handleNotificationChange(notifications){
    const data = _.assign({}, this.getFinalData(), {notifications});
    this.props.onChange(data);
  },
  handleInputChange(data){
    this.props.onChange(data);
  },
  handleSubmit(e) {
    if (e){
      e.preventDefault();
    }
    this.props.analyticsActions.trackEvent('Onboard', 'check-created');
    this.props.onSubmit();
  },
  renderHelperText(){
    return (
        <UserDataRequirement hideIf="hasDismissedCheckInfoHelp">
          <Alert color="success" onDismiss={this.runDismissHelperText}>
            Your check is almost done! All you have to do is give it a name and tell us where to send notifications if the check fails.<br/>
            <strong>Opsee automatically runs your check every 30 seconds</strong>.
          </Alert>
        </UserDataRequirement>
      );
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <StatusHandler status={this.props.redux.asyncActions.checkCreate.status}/>
          <Button color="success" block onClick={this.handleSubmit} disabled={this.isDisabled()} chevron>Finish</Button>
          <CheckDisabledReason check={this.props.check} areas={['info', 'notifications']}/>
        </div>
      );
    }
    return null;
  },
  renderInner() {
    return (
      <div>
        <Padding b={2}>
          <form name="checkCreateInfoForm">
            <Input data={this.props.check} path="name" placeholder="My Critical Service Status 200 Check" label="Check Name*" onChange={this.handleInputChange}/>
          </form>
        </Padding>

        <Padding t={2} b={1}>
          <Heading level={3}>Notifications</Heading>
          <p>Choose from the options below to set up your notifications.</p>
          <hr/>
          <NotificationSelection onChange={this.handleNotificationChange} notifications={this.props.check.notifications}/>
        </Padding>
        <Padding b={1}>
          {this.renderSubmitButton()}
        </Padding>
      </div>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create a Check" bg="info">
          <Button to="/" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement>
                <Padding b={3}>
                  {this.renderHelperText()}
                </Padding>
                {this.renderInner()}
              </BastionRequirement>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
  render() {
    return this.props.renderAsInclude ? this.renderInner() : this.renderAsPage();
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  analyticsActions: bindActionCreators(analyticsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckCreateInfo);