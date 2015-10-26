import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import Immutable, {Record} from 'immutable';

import router from '../../modules/router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, ListItem, Modal} from '../global';
import {CheckActions} from '../../actions';
import {Settings, NewWindow, Refresh} from '../icons';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {Padding} from '../layout';

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
    <Button icon={true} flat={true} secondary={true} onClick={this.openMenu} title="Check Menu">
      <Settings fill={colors.textColorSecondary} btn={true}/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getLink()} params={{id:this.props.item.get('id')}} title={`Open ${this.props.item.get('check_spec').value.name} in a New Window`} icon={true} flat={true} target="_blank" className={listItem.btn}>
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
                  <h3>{this.props.item.get('check_spec').value.name} Actions</h3>
                </Padding>
                <Button className="text-left" color="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Test')}>
                  <Refresh className="icon"/> Test
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
        <div className="line-height-1 flex-1 display-flex">
          <Link to={this.getLink()} params={{id:this.props.item.get('id'), name:this.props.item.get('check_spec').value.name}} className={listItem.link} style={{maxWidth:'100%'}}>
            {this.renderGraph()}
            <div className="flex-vertical-align">
              <div>{this.props.item.get('check_spec').value.name}</div>
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

export default CheckItem;