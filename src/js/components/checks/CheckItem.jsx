import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import Immutable, {Record} from 'immutable';

import router from '../../modules/router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, ListItem, Modal} from '../global';
import {CheckActions} from '../../actions';
import {MoreHoriz, NewWindow} from '../icons';
import {Button} from '../forms';

const CheckItem = React.createClass({
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
  getLink(){
    return 'check';
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
  getActions(){
    return ['Test'];
  },
  runAction(action){
  },
  hideContextMenu(){
    this.setState({showModal:false});
  },
  onClick(e){
    if(typeof this.props.onClick == 'function'){
      e.preventDefault();
      this.props.onClick(this.props.item.get('id'), this.props.item.get('type'));
    }
  },
  renderButton(){
    return (
    <Button icon={true} flat={true} onClick={this.openMenu} title="Check Menu" className="btn btn-icon btn-secondary">
      <MoreHoriz btn={true}/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getLink()} params={{id:this.props.item.get('id')}} title={`Open ${this.props.item.get('check_spec').value.name} in a New Window`} icon={true} flat={true} target="_blank" className="list-item-btn">
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
            <h3>{this.props.item.get('check_spec').value.name} Actions</h3>
          </Grid>
          {
            this.getActions().map(a => {
              return <Button block={true} flat={true} onClick={this.runAction.bind(null, a)} className="text-left" style={{margin:0}}>{a}</Button>
            })
          }
        </Modal>
      )
    }
  },
  render(){
    return (
      <div key="listItem" className="list-item" onClick={this.onClick}>
        {this.renderModal()}
        {this.renderGraph()}
        <div className="line-height-1 flex-1 align-self-stretch display-flex">
          <Link to={this.getLink()} params={{id:this.props.item.get('id'), name:this.props.item.get('check_spec').value.name}} className="list-item-link flex-1 align-items-center" style={{maxWidth:'100%'}}>
            <div>{this.props.item.get('check_spec').value.name}</div>
          </Link>
          {this.props.linkInsteadOfMenu ? this.renderLinkButton() : this.renderButton()}
          {
          // <div className="text-secondary">X of Y passing (N instances)</div>
          }
        </div>
      </div>
    );
  }
});

export default Radium(CheckItem);