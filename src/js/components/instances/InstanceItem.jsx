import React, {PropTypes} from 'react';
import {Record} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ListItem} from '../global';
import {Close, ListCheckmark} from '../icons';
import {env as actions, app as appActions} from '../../actions';
import style from '../global/contextMenu.css';
import InstanceMenu from './InstanceMenu';

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
        <ListItem type="Group" link={this.getLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} onClick={this.props.onClick} state={this.props.item.state} item={this.props.item} onClose={this.runResetPageState} noMenu>
          <InstanceMenu item={this.props.item} key="menu"/>
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