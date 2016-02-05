import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {BastionRequirement, Toolbar} from '../global';
import {BoundField, Button} from '../forms';
import {Close} from '../icons';
import {StatusHandler} from '../global';
import {UserDataRequirement} from '../user';
import {Padding} from '../layout';
import NotificationSelection from './NotificationSelection';
import {
  checks as actions,
  user as userActions,
  analytics as analyticsActions
} from '../../actions';

const InfoForm = forms.Form.extend({
  name: forms.CharField({
    label: 'Check name',
    widgetAttrs: {
      placeholder: 'My Service 404 Check'
    }
  }),
  validation: 'auto',
  render() {
    return (
      <Padding b={1}>
        <BoundField bf={this.boundField('name')}/>
      </Padding>
    );
  }
});

const CheckCreateInfo = React.createClass({
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool,
    onSubmit: PropTypes.func,
    history: PropTypes.shape({
      pushState: PropTypes.func
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
  getInitialState() {
    const self = this;

    const obj = {
      info: new InfoForm({
        onChange: self.runChange,
        labelSuffix: '',
        data: {
          name: self.props.check.name || `Http ${self.props.check.target.name || self.props.check.target.id}`
        }
      }),
      notifications: []
    };
    return obj;
  },
  componentWillMount(){
    if (!this.props.check.assertions.length || !this.props.check.target.id){
      //intentionally fail
      let intentionalcirclefailure;
      // this.props.history.pushState(null, '/check-create/target');
    }
  },
  componentDidMount(){
    if (this.props.renderAsInclude){
      this.runChange();
    }
  },
  getFinalData(){
    let check = _.cloneDeep(this.props.check);
    check.name = check.check_spec.value.name = this.state.info.cleanedData.name;
    check.notifications = this.getNotifications();
    return check;
  },
  getCleanedData(){
    return _.assign({}, {
      notifications: this.state.notifications
    }, this.state.info.cleanedData);
  },
  getNotifications(){
    return _.reject(this.state.notifications, (n = {}) => {
      return !n.type || !n.value;
    });
  },
  isDataComplete(){
    return this.props.check.check_spec.value.name;
  },
  isDisabled(){
    const notifs = _.chain(this.state.notifications).map((n = {}) => {
      return n.type && n.value;
    }).value();
    const notifsComplete = _.every(notifs) && notifs.length;
    return !(this.state.info.isComplete() && notifsComplete) || this.props.redux.asyncActions.checkCreate.status === 'pending';
  },
  runChange(){
    this.props.onChange(this.getFinalData(), this.isDisabled(), 3);
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckInfoHelp');
  },
  handleNotificationChange(notifications){
    this.setState({
      notifications
    });
    const data = _.assign({}, this.getFinalData(), {notifications});
    this.props.onChange(data, this.isDisabled(), 3);
  },
  handleSubmit(e) {
    if (e){
      e.preventDefault();
    }
    this.props.analyticsActions.trackEvent('Onboard', 'check-created');
    this.props.onSubmit();
  },
  renderRemoveNotificationButton(form, index){
    if (index > 0){
      return (
        <Padding t={2}>
          <BoundField bf={form.boundField('DELETE')}/>
        </Padding>
      );
    }
    return (
      <Padding lr={1}>
       <div style={{width: '48px'}}/>
     </Padding>
    );
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <Padding t={2}>
            <StatusHandler status={this.props.redux.asyncActions.checkCreate.status}/>
            <Button color="success" block onClick={this.handleSubmit} disabled={this.isDisabled()} chevron>Finish</Button>
          </Padding>
        </div>
      );
    }
    return null;
  },
  renderHelperText(){
    return (
        <UserDataRequirement hideIf="hasDismissedCheckInfoHelp">
          <Alert bsStyle="success" onDismiss={this.runDismissHelperText}>
            <p>Your check is almost done! All you have to do is give it a name and tell us where to send notifications if the check fails.</p>
            <p><strong>Opsee automatically runs your check every 30 seconds</strong>.</p>
          </Alert>
        </UserDataRequirement>
      );
  },
  renderInner() {
    return (
      <div>
        <Padding b={2}>
          <form name="checkCreateInfoForm">
            {this.state.info.render()}
            </form>
          <em className="small text-muted">For display in the Opsee app</em>
        </Padding>
        <NotificationSelection onChange={this.handleNotificationChange} notifications={this.props.check.notifications}/>
        {this.renderSubmitButton()}
      </div>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (4 of 4)" bg="info">
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