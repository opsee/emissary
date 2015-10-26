import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import Immutable, {Record} from 'immutable';

import router from '../../modules/router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, ListItem, Modal} from '../global';
import {CheckActions, InstanceActions} from '../../actions';
import {Settings, NewWindow, Refresh, Stop, Play, Delete} from '../icons';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {Padding} from '../layout';

const InstanceItem = React.createClass({
  propTypes:{
    item:React.PropTypes.instanceOf(Record).isRequired,
  },
  getInitialState(){
    return _.assign({},{
      showModal:false
    });
  },
  actions(e, id){
    e.preventDefault();
    console.log(this.props.item.get('id'));
  },
  getInstanceLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `instance${suffix}`;
  },
  isSelected(){
    return this.props.selected && this.props.selected == this.props.item.get('id');
  },
  openMenu(e){
    e.preventDefault();
    this.setState({
      showModal:true
    });
  },
  runAction(action, id){
    InstanceActions.runInstanceAction({id});
  },
  hideContextMenu(){
    this.setState({showModal:false});
  },
  renderStatusText(){
    if(this.props.item.get('state') == 'restarting'){
      return <span>:&nbsp;(Restarting)</span>
    }else{
      return <span/>
    }
  },
  onClick(e){
    if(typeof this.props.onClick == 'function'){
      e.preventDefault();
      this.props.onClick(this.props.item.get('id'), this.props.item.get('type'));
    }
  },
  renderButton(){
    return (
    <Button icon={true} flat={true} secondary={true} onClick={this.openMenu} title="Instance Menu">
      <Settings fill={colors.textColorSecondary} btn={true}/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getInstanceLink()} params={{id:this.props.item.get('id')}} title={`Open ${this.props.item.get('name')} in a New Window`} icon={true} flat={true} target="_blank" className={listItem.btn}>
        <NewWindow btn={true} fill={colors.textColorSecondary}/>
    </Button>
    );
  },
  renderGraph(){
    if(!this.props.noGraph){
      return <RadialGraph {...this.props.item.toJS()}/>
    }else{
      return <div/>
    }
  },
  renderModal(){
    if(!this.props.noModal){
      return(
        <Modal show={this.state.showModal} onHide={this.hideContextMenu} className="context" style="default">
          <Grid fluid={true}>
            <Row>
              <div className="flex-1">
                <Padding lr={1}>
                  <h3>{this.props.item.get('name')} Actions</h3>
                </Padding>
                <Button text="left" color="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Restart', this.props.item.get('id'))}>
                  <Refresh inline={true} fill="primary"/> Restart
                </Button>
                <Button text="left" color="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Stop')}>
                  <Stop inline={true} fill="primary"/> Stop
                </Button>
                <Button text="left" color="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Start')}>
                  <Play inline={true} fill="primary"/> Start
                </Button>
                <Button text="left" color="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Start')}>
                  <Delete inline={true} fill="primary"/> Terminate
                </Button>
              </div>
            </Row>
          </Grid>
        </Modal>
      )
    }
  },
  render(){
    return (
      <div key="listItem" className={listItem.item} onClick={this.onClick}>
        {this.renderModal()}
        <div className="line-height-1 flex-1 align-self-stretch display-flex">
          <Link to={this.getInstanceLink()} params={{id:this.props.item.get('id'), name:this.props.item.get('name')}} className={listItem.link} style={{maxWidth:'100%'}}>
            {this.renderGraph()}
            <div className="flex-vertical-align">
              <div>{this.props.item.get('name')}{this.renderStatusText()}</div>
              {
              // <div className="text-secondary">X of Y passing</div>
              }
            </div>
          </Link>
          {this.props.linkInsteadOfMenu ? this.renderLinkButton() : this.renderButton()}
        </div>
      </div>
    );
  }
});

export default InstanceItem;