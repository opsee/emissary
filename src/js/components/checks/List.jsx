import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import cx from 'classnames';
import _ from 'lodash';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {Add} from '../icons';
import {UserDataRequirement} from '../user';
import CheckItemList from './CheckItemList.jsx';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import {checks as actions, user as userActions, app as appActions} from '../../actions';
import listItem from '../global/listItem.css';

const CheckList = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getChecks: PropTypes.func.isRequired,
      selectToggle: PropTypes.func.isRequired,
      delSelected: PropTypes.func.isRequired
    }),
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    appActions: PropTypes.shape({
      confirmOpen: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object
      }),
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        getChecks: PropTypes.object,
        checksDelete: PropTypes.object
      })
    })
  },
  getInitialState() {
    return {
      notifEditing: false
    };
  },
  componentWillMount(){
    this.props.actions.getChecks();
  },
  componentWillUpdate(nextProps) {
    const oldStatus = this.props.redux.asyncActions.checksDelete.status;
    const newStatus = nextProps.redux.asyncActions.checksDelete.status;
    if (oldStatus !== newStatus && newStatus === 'success'){
      this.props.actions.getChecks();
    }
  },
  getSelectedChecks(){
    return this.props.redux.checks.checks.filter(check => {
      return check.get('selected');
    });
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckTypeHelp');
  },
  handleNotifEdit(){
    this.setState({
      notifEditing: true
    });
  },
  handleSelectorClick(){
    this.props.actions.selectToggle();
  },
  handleDeleteClick(){
    const selected = this.getSelectedChecks();
    const {size} = selected;
    const copy = size > 1 ? `these ${size} checks` : 'this check';
    this.props.appActions.confirmOpen({
      html: `<p>Are you sure you want to delete ${copy}?</p>`,
      confirmText: 'Yes, delete',
      color: 'danger',
      onConfirm: this.props.actions.delSelected
    });
  },
  renderAutoMessage(){
    return (
      <UserDataRequirement hideIf="hasDismissedCheckAssertionsHelp">
        <Padding b={2}>
          <Alert color="success" onDismiss={this.runDismissHelperText}>
            Now the fun part. Assertions are used to determine passing or failing state. A simple and effective assertion might be: <strong>'Status Code equal to 200'</strong>. When defining multiple assertions, <strong>all</strong> must pass for the check to be deemed <em>passing</em>.
          </Alert>
        </Padding>
      </UserDataRequirement>
    );
  },
  renderChecks(){
    if (!this.props.redux.checks.checks.size) {
      //TODO - figure out why <Link> element is causing react to throw an error. Has something to do with statushandler and link.
      return (
        <StatusHandler status={this.props.redux.asyncActions.getChecks.status}>
          <Padding b={2}><Heading level={2}>Welcome to Opsee! Let&rsquo;s get started.</Heading></Padding>
          <p>Thanks for signing up! Let&rsquo;s get your environment set up:</p>

          <ol>
            <li><Link to="/check-create" title="Create New Check">Create your first health check</Link> for any public URL</li>
            <li>Keep your team in the loop by setting up <a href="/profile">Slack and Pagerduty integration</a> on your Profile page</li>
            <li>If you&rsquo;re hosted in AWS, <a href="/start/launch-stack">add our EC2 instance</a> to run checks inside your environment too</li>
          </ol>
        </StatusHandler>
      );
    }
    return (
      <div>
        <CheckItemList title selectable/>
      </div>
    );
  },
  renderActionBar(){
    if (!this.props.redux.checks.checks.size) {
      return null;
    }
    const selected = this.getSelectedChecks();
    const {size} = selected;
    const title = size > 0 ? 'Unselect All' : 'Select All';
    const inner = size > 0 ? <div className={listItem.selectorInner}/> : null;
    const isDeleting = this.props.redux.asyncActions.checksDelete.status === 'pending';
    const isDisabled = isDeleting || size < 1;
    if (this.props.redux.checks.checks.size) {
      return (
        <Padding a={2} className="display-flex" style={{paddingRight: '0.8rem'}}>
          <div className="flex-1 display-flex">
            <Padding r={1}>
              <Button to={{pathname: 'checks-notifications', query: {selected: JSON.stringify(_.map(selected.toJS(), 'id'))}}} flat color="default" disabled={isDisabled} style={{opacity: isDisabled ? 0.3 : 1}}>Edit Notifications</Button>
            </Padding>
            <Padding r={1}>
              <Button onClick={this.handleDeleteClick} flat color="danger" disabled={isDisabled} style={{opacity: isDisabled ? 0.3 : 1}}>{isDeleting ? 'Deleting...' : 'Delete'}</Button>
            </Padding>
          </div>
          <div className={listItem[this.props.scheme]}>
            <Button className={cx(listItem.selector, size > 0 && listItem.selectorSelected)} onClick={this.handleSelectorClick} title={title} style={{margin: 0}}>{inner}</Button>
          </div>
        </Padding>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        <Toolbar title="Checks" />
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                <BastionRequirement>
                  {this.renderActionBar()}
                  {this.renderChecks()}
                </BastionRequirement>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckList);