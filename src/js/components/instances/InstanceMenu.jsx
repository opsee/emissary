import React, {PropTypes} from 'react';
import {Record, is} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TimeAgo from 'react-timeago';
import _ from 'lodash';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import {ContextMenu, StatusHandler} from '../global';
import {Add, Play, Refresh, Stop} from '../icons';
import {Button} from '../forms';
import {Padding} from '../layout';
import {Heading} from '../type';
import {env as actions, app as appActions} from '../../actions';
import {flag} from '../../modules';

const InstanceMenu = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    onClick: PropTypes.func,
    actions: PropTypes.shape({
      startInstances: PropTypes.func,
      stopInstances: PropTypes.func,
      rebootInstances: PropTypes.func
    }),
    appActions: PropTypes.shape({
      closeContextMenu: PropTypes.func
    }),
    asyncActions: PropTypes.shape({
      awsStartInstances: PropTypes.object,
      awsStopInstances: PropTypes.object,
      awsRebootInstances: PropTypes.object
    })
  },
  getInitialState() {
    return {
      activePage: 0,
      direction: 'forward'
    };
  },
  shouldComponentUpdate(nextProps, nextState) {
    const async1 = this.props.asyncActions;
    const async2 = nextProps.asyncActions;
    const cond1 = !is(this.props.item, nextProps.item);
    const cond2 = async1.awsStartInstances.status !== async2.awsStartInstances.status;
    const cond3 = async1.awsStopInstances.status !== async2.awsStopInstances.status;
    const cond4 = async1.awsRebootInstances.status !== async2.awsRebootInstances.status;
    const cond5 = !_.isEqual(this.state, nextState);
    return (cond1 || cond2 || cond3 || cond4 || cond5);
  },
  getCreateCheckLink(){
    const target = _.pick(this.props.item.toJS(), ['id', 'type', 'name']);
    const data = JSON.stringify({target});
    return `/check-create/request?data=${data}`;
  },
  runStartConfirm(){
    this.props.actions.startInstances([this.props.item.get('id')]);
    // this.props.appActions.closeContextMenu();
  },
  runStopConfirm(){
    this.props.actions.stopInstances([this.props.item.get('id')]);
    // this.props.appActions.closeContextMenu();
  },
  runRebootConfirm(){
    this.props.actions.rebootInstances([this.props.item.get('id')]);
    // this.props.appActions.closeContextMenu();
  },
  runResetPageState(){
    this.setState({
      activePage: 0,
      direction: 'reverse'
    });
  },
  handleStartClick(){
    this.setState({
      activePage: 1,
      direction: 'forward'
    });
  },
  handleStopClick(){
    this.setState({
      activePage: 2,
      direction: 'forward'
    });
  },
  handleRebootClick(){
    this.setState({
      activePage: 3,
      direction: 'forward'
    });
  },
  renderActions(){
    if (flag('instance-ecc-actions')) {
      return (
        <div>
          <Button color="primary" text="left" block flat onClick={this.handleStartClick}>
            <Play inline fill="primary"/> Start
          </Button>
          <Button color="primary" text="left" block flat onClick={this.handleStopClick}>
            <Stop inline fill="primary"/> Stop
          </Button>
          <Button color="primary" text="left" block flat onClick={this.handleRebootClick}>
            <Refresh inline fill="primary"/> Reboot
          </Button>
        </div>
      );
    }
    return null;
  },
  renderPage0(){
    const {item} = this.props;
    return (
      <div key="page0">
        <Padding lr={1} t={2}>
          <Heading level={3}>{item.get('name')} Actions</Heading>
        </Padding>
        <Button color="primary" text="left" to={this.getCreateCheckLink()} block flat>
          <Add inline fill="primary"/> Create Check
        </Button>
        {this.renderActions()}
      </div>
    );
  },
  renderPage1(){
    const {asyncActions} = this.props;
    return (
      <div key="page1">
        <Padding lr={1}>
          <Heading level={3}>Start this Instance?</Heading>
          <div>Press and hold to confirm.</div>
        </Padding>
        <Button color="danger" text="left" block flat onClick={this.runResetPageState}>No</Button>
        <Button color="primary" text="left" block flat disabled={asyncActions.awsStartInstances.status === 'pending'} onPressUp={this.runStartConfirm}>Yes</Button>
        <Padding>
          <StatusHandler status={asyncActions.awsStartInstances.status}>
            Command successfully sent to <strong>Start</strong> instance {this.props.item.get('id')}<br/><TimeAgo date={asyncActions.awsStartInstances.time}/>.
          </StatusHandler>
        </Padding>
      </div>
    );
  },
  renderPage2(){
    const {asyncActions} = this.props;
    return (
      <div key="page2">
        <Padding lr={1}>
          <Heading level={3}>Stop this Instance?</Heading>
          <div>Press and hold to confirm.</div>
        </Padding>
        <Button color="danger" text="left" block flat onClick={this.runResetPageState}>No</Button>
        <Button color="primary" text="left" block flat onPressUp={this.runStopConfirm} disabled={asyncActions.awsStopInstances.status === 'pending'}>Yes</Button>
        <Padding>
          <StatusHandler status={asyncActions.awsStopInstances.status}>
            Command successfully sent to <strong>Stop</strong> instance {this.props.item.get('id')}<br/><TimeAgo date={asyncActions.awsStopInstances.time}/>.
          </StatusHandler>
        </Padding>
      </div>
    );
  },
  renderPage3(){
    const {asyncActions} = this.props;
    return (
      <div key="page3">
        <Padding lr={1}>
          <Heading level={3}>Reboot this Instance?</Heading>
          <div>Press and hold to confirm.</div>
        </Padding>
        <Button color="danger" text="left" block flat onClick={this.runResetPageState}>No</Button>
        <Button color="primary" text="left" block flat onPressUp={this.runRebootConfirm} disabled={asyncActions.awsRebootInstances.status === 'pending'}>Yes</Button>
        <Padding>
          <StatusHandler status={asyncActions.awsRebootInstances.status}>
            Command successfully sent to <strong>Reboot</strong> instance {this.props.item.get('id')}<br/><TimeAgo date={asyncActions.awsRebootInstances.time}/>.
          </StatusHandler>
        </Padding>
      </div>
    );
  },
  renderPage(){
    return this[`renderPage${this.state.activePage}`]();
  },
  render(){
    if (this.props.item.get('id')){
      // `slide-${this.state.direction}`
      return (
        <ContextMenu id={this.props.item.get('id')} onHide={this.runResetPageState} noTitle>
          <CSSTransitionGroup transitionName="page" transitionEnterTimeout={400} transitionLeaveTimeout={400} component="div">
            {this.renderPage()}
          </CSSTransitionGroup>
        </ContextMenu>
      );
    }
    return null;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

const mapStateToProps = (state) => ({
  asyncActions: state.asyncActions
});

export default connect(mapStateToProps, mapDispatchToProps)(InstanceMenu);