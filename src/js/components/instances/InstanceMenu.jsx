import React, {PropTypes} from 'react';
import {Record} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TimeAgo from 'react-timeago';

import {ContextMenu, StatusHandler} from '../global';
import {Add, Play, Refresh, Stop} from '../icons';
import {Button} from '../forms';
import {Padding} from '../layout';
import {env as actions, app as appActions} from '../../reduxactions';
import style from '../global/contextMenu.css';

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
      activePage: 'page1'
    };
  },
  getPageClass(string){
    return this.state.activePage === string ? style.pageActive : style.page;
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
      activePage: 'page1'
    });
  },
  handleStartClick(){
    this.setState({activePage: 'page2'});
  },
  handleStopClick(){
    this.setState({activePage: 'page3'});
  },
  handleRebootClick(){
    this.setState({activePage: 'page4'});
  },
  render(){
    const {item} = this.props;
    const {asyncActions} = this.props.redux;
    if (item.get('id')){
      return (
        <ContextMenu id={item.get('id')} title={`${item.get('name')} Actions`} onHide={this.runResetPageState}>
          <div className={this.getPageClass('page1')}>
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
          <div className={this.getPageClass('page2')}>
            <Padding lr={1}>
              <h3>Start this Instance?</h3>
            </Padding>
            <Button color="danger" text="left" block flat onClick={this.runResetPageState}>No</Button>
            <Button color="primary" text="left" block flat onClick={this.runStartConfirm} disabled={asyncActions.awsStartInstances.status === 'pending'}>Yes</Button>
            <Padding>
              <StatusHandler status={asyncActions.awsStartInstances.status}>
                Command successfully sent to <strong>Start</strong> instance {item.get('id')}<br/><TimeAgo date={asyncActions.awsStartInstances.time}/>.
              </StatusHandler>
            </Padding>
          </div>
          <div className={this.getPageClass('page3')}>
            <Padding lr={1}>
              <h3>Stop this Instance?</h3>
            </Padding>
            <Button color="danger" text="left" block flat onClick={this.runResetPageState}>No</Button>
            <Button color="primary" text="left" block flat onClick={this.runStopConfirm} disabled={asyncActions.awsStopInstances.status === 'pending'}>Yes</Button>
            <Padding>
              <StatusHandler status={asyncActions.awsStopInstances.status}>
                Command successfully sent to <strong>Stop</strong> instance {item.get('id')}<br/><TimeAgo date={asyncActions.awsStopInstances.time}/>.
              </StatusHandler>
            </Padding>
          </div>
          <div className={this.getPageClass('page4')}>
            <Padding lr={1}>
              <h3>Reboot this Instance?</h3>
            </Padding>
            <Button color="danger" text="left" block flat onClick={this.runResetPageState}>No</Button>
            <Button color="primary" text="left" block flat onClick={this.runRebootConfirm} disabled={asyncActions.awsRebootInstances.status === 'pending'}>Yes</Button>
            <Padding>
              <StatusHandler status={asyncActions.awsRebootInstances.status}>
                Command successfully sent to <strong>Reboot</strong> instance {item.get('id')}<br/><TimeAgo date={asyncActions.awsRebootInstances.time}/>.
              </StatusHandler>
            </Padding>
          </div>
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