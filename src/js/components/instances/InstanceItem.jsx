import React, {PropTypes} from 'react';
import {Record} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ListItem} from '../global';
import {Add, Close, ListCheckmark, Play, Refresh, Stop} from '../icons';
import {Button} from '../forms';
import {Padding} from '../layout';
import {env as actions, app as appActions} from '../../reduxactions';
import style from '../global/contextMenu.css';

const InstanceItem = React.createClass({
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
  getLink(){
    const type = this.props.item.get('type').toLowerCase();
    return `/instance/${type}/${this.props.item.get('id')}`;
  },
  runStartConfirm(){
    this.props.actions.startInstances([this.props.item.get('id')]);
    this.props.appActions.closeContextMenu();
  },
  runStopConfirm(){
    this.props.actions.stopInstances([this.props.item.get('id')]);
    this.props.appActions.closeContextMenu();
  },
  runRebootConfirm(){
    this.props.actions.rebootInstances([this.props.item.get('id')]);
    this.props.appActions.closeContextMenu();
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
  renderInfoText(){
    if (this.props.item.get('total')){
      return (
        <span>
          <ListCheckmark inline fill="textSecondary"/>{this.props.item.get('passing')}
          &nbsp;&nbsp;
          <Close inline fill="textSecondary"/>{this.props.item.get('total') - this.props.item.get('passing')}
        </span>
      );
    }else if (this.props.item.get('checks').size){
      return 'Initializing checks';
    }
    return (
      <span>
        <ListCheckmark inline fill="textSecondary"/>No checks
      </span>
    );
  },
  render(){
    if (this.props.item.get('name')){
      return (
        <ListItem type="Group" link={this.getLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} onClick={this.props.onClick} state={this.props.item.state} item={this.props.item} onClose={this.runResetPageState}>
          <div key="menu">
            <div className={this.getPageClass('page1')}>
              <Button color="primary" text="left" to={`/check-create/request?id=${this.props.item.get('id')}&type=${this.props.item.get('type')}&name=${this.props.item.get('name')}`} block flat>
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
              <Button color="primary" text="left" block flat onClick={this.runStartConfirm}>Yes</Button>
            </div>
            <div className={this.getPageClass('page3')}>
              <Padding lr={1}>
                <h3>Stop this Instance?</h3>
              </Padding>
              <Button color="danger" text="left" block flat onClick={this.runResetPageState}>No</Button>
              <Button color="primary" text="left" block flat onClick={this.runStopConfirm}>Yes</Button>
            </div>
            <div className={this.getPageClass('page4')}>
              <Padding lr={1}>
                <h3>Reboot this Instance?</h3>
              </Padding>
              <Button color="danger" text="left" block flat onClick={this.runResetPageState}>No</Button>
              <Button color="primary" text="left" block flat onClick={this.runRebootConfirm}>Yes</Button>
            </div>
          </div>
          <div key="line1">{this.props.item.get('name')}</div>
          <div key="line2">{this.renderInfoText()}</div>
        </ListItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(InstanceItem);