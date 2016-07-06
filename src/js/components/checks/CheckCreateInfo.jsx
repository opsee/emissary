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
import {Alert, Col, Grid, Padding, Panel, Row} from '../layout';
import NotificationSelection from './NotificationSelection';
import CheckDisabledReason from './CheckDisabledReason';
import {flag, validate} from '../../modules';
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
  getInitialState() {
    return {
      advanced: undefined
    };
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
  getAdvancedOptionsBool(){
    const arr = _.get(this.props.redux.user.get('data'), 'advancedCheckOptions') || [];
    if (this.state.advanced !== undefined){
      return this.state.advanced;
    }
    let bools = [_.chain(arr).last().get('data').value()];
    bools.push(this.props.check.min_failing_time !== 90);
    bools.push(this.props.check.min_failing_count !== 1);
    return _.some(bools);
  },
  isDisabled(){
    return !!validate.check(this.props.check).length || this.props.redux.asyncActions.checkCreate.status === 'pending';
  },
  shouldShowHideAdvancedOptions(){
    let bools = [];
    bools.push(this.props.check.min_failing_time === 90);
    bools.push(this.props.check.min_failing_count === 1);
    return _.every(bools);
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
    const time = _.toFinite(data.min_failing_time);
    const failing = _.toFinite(data.min_failing_count);
    const check = _.assign(data, {
      min_failing_time: time || null,
      min_failing_count: failing || null
    });
    this.props.onChange(check);
  },
  handleAdvancedOptionsClick(e){
    e.preventDefault();
    const bool = this.getAdvancedOptionsBool();
    this.setState({
      advanced: !bool
    });
    this.props.userActions.putData('advancedCheckOptions', !bool, bool);
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
  renderHideAdvancedOptionsButton(){
    if (this.shouldShowHideAdvancedOptions()){
      return (
        <Padding t={1}>
          <a href="#" onClick={this.handleAdvancedOptionsClick}>Hide Advanced Options</a>
        </Padding>
      );
    }
    return null;
  },
  renderAdvancedOptions(){
    if (flag('check-advanced-options')){
      return (
        <div>
          <Heading level={3}>Advanced Options</Heading>
          {this.renderAdvancedInputs()}
        </div>
      );
    }
    return null;
  },
  renderAdvancedInputs(){
    if (this.getAdvancedOptionsBool()){
      return (
        <div>
          <div className="display-flex align-items-flex-end">
            <Padding r={1} className="flex-1">
              <Input data={this.props.check} path="min_failing_time" placeholder="90" label="Minimum Failing Time (Seconds)*" onChange={this.handleInputChange}/>
            </Padding>
            <div className="flex-1">
              <Input data={this.props.check} path="min_failing_count" placeholder="1" label="Minimum Failing Count <br/>(Responses or DNS Entries)*" onChange={this.handleInputChange}/>
            </div>
          </div>
          {this.renderHideAdvancedOptionsButton()}
        </div>
      );
    }
    return (
      <a href="#" onClick={this.handleAdvancedOptionsClick}>Show Advanced Check Options</a>
    );
  },
  renderInner() {
    return (
      <div>
        <Padding b={2}>
          <form name="checkCreateInfoForm">
            <Padding b={2}>
              <Input data={this.props.check} path="name" placeholder="My Critical Service Status 200 Check" label="Check Name*" onChange={this.handleInputChange}/>
            </Padding>
          </form>
        </Padding>

        <Padding t={2} b={1}>
          <Heading level={3}>Notifications</Heading>
          <p>Choose from the options below to set up your notifications.</p>
          <hr/>
          <NotificationSelection onChange={this.handleNotificationChange} notifications={this.props.check.notifications}/>
          <Padding b={1}>
            {this.renderAdvancedOptions()}
          </Padding>
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
              <Padding t={2}>
                <Panel>
                  <BastionRequirement>
                    <Padding b={3}>
                      {this.renderHelperText()}
                    </Padding>
                    {this.renderInner()}
                  </BastionRequirement>
                </Panel>
              </Padding>
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