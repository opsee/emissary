import React, {PropTypes} from 'react';
import {Record} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TimeAgo from 'react-timeago';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import {ContextMenu, StatusHandler} from '../global';
import {Add, Play, Refresh, Stop} from '../icons';
import {Button} from '../forms';
import {Padding} from '../layout';
import {env as actions, app as appActions} from '../../actions';

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
    redux: PropTypes.shape({
      asyncActions: PropTypes.object
    })
  },
  getInitialState() {
    return {
      activePage: 0,
      direction: 'forward'
    };
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
  renderPage0(){
    const {item} = this.props;
    return (
      <div key="page0">
        <Padding lr={1}>
          <h3>{this.props.item.get('name')} Actions</h3>
        </Padding>
        <Button color="primary" text="left" to={`/check-create/request?id=${item.get('id')}&type=${item.get('type')}&name=${item.get('name')}`} block flat>
          <Add inline fill="primary"/> Create Check
        </Button>
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
  },
  renderPage1(){
    const {asyncActions} = this.props.redux;
    return (
      <div key="page1">
        <Padding lr={1}>
          <h3>Start this Instance?</h3>
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
    const {asyncActions} = this.props.redux;
    return (
      <div key="page2">
        <Padding lr={1}>
          <h3>Stop this Instance?</h3>
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
    const {asyncActions} = this.props.redux;
    return (
      <div key="page3">
        <Padding lr={1}>
          <h3>Reboot this Instance?</h3>
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
    return <div/>;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps, mapDispatchToProps)(InstanceMenu);