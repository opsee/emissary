import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import Immutable, {Record} from 'immutable';

import router from '../../modules/router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, ListItem, Modal} from '../global';
import {CheckActions} from '../../actions';
import {Settings, NewWindow, Refresh, Stop, Play, Delete} from '../icons';
import {Button} from '../forms';

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
  runAction(action){
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
    <Button icon={true} flat={true} onClick={this.openMenu} title="Instance Menu" className="btn-secondary">
      <Settings fill={colors.textColorSecondary} btn={true}/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getInstanceLink()} params={{id:this.props.item.get('id')}} title={`Open ${this.props.item.get('name')} in a New Window`} icon={true} flat={true} target="_blank" className="list-item-btn">
        <NewWindow btn={true} fill={Radium.getState(this.state, 'listItem', ':hover') ? colors.gray900 : colors.gray700}/>
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
              <Col className="padding-b-md">
                <h3>{this.props.item.get('name')} Actions</h3>
                <Button className="text-left" bsStyle="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Restart')}>
                  <Refresh className="icon"/> Restart
                </Button>
                <Button className="text-left" bsStyle="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Stop')}>
                  <Stop className="icon"/> Stop
                </Button>
                <Button className="text-left" bsStyle="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Start')}>
                  <Play className="icon"/> Start
                </Button>
                <Button className="text-left" bsStyle="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Start')}>
                  <Delete className="icon"/> Terminate
                </Button>
              </Col>
            </Row>
          </Grid>
        </Modal>
      )
    }
  },
  render(){
    return (
      <div key="listItem" className="list-item" onClick={this.onClick}>
        {this.renderModal()}
        <div className="line-height-1 flex-1 align-self-stretch display-flex">
          <Link to={this.getInstanceLink()} params={{id:this.props.item.get('id'), name:this.props.item.get('name')}} className="list-item-link flex-1 align-items-start" style={{maxWidth:'100%'}}>
            {this.renderGraph()}
            <div>
              <div>{this.props.item.get('name')}{this.renderStatusText()}</div>
              <div className="text-secondary">X of Y passing</div>
            </div>
          </Link>
          {this.props.linkInsteadOfMenu ? this.renderLinkButton() : this.renderButton()}
        </div>
      </div>
    );
  }
});

export default Radium(InstanceItem);