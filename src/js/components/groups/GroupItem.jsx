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

const GroupItem = React.createClass({
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
  getGroupLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `group${suffix}`;
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
    return ['Create Check'];
  },
  runAction(action){
  },
  hideContextMenu(){
    this.setState({showModal:false});
  },
  getStyle(){
    let obj = {};
    if(this.props.noBorder){
      obj.border = 0;
    }
    return obj;
  },
  onClick(e){
    if(typeof this.props.onClick == 'function'){
      e.preventDefault();
      this.props.onClick(this.props.item.get('id'), this.props.item.get('type'));
    }
  },
  renderButton(){
    return (
    <Button icon={true} flat={true} onClick={this.openMenu} title="Group Menu" className="btn btn-icon btn-secondary">
      <MoreHoriz btn={true}/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getGroupLink()} params={{id:this.props.item.get('id')}} title={`Open ${this.props.item.get('name')} in a New Window`} icon={true} flat={true} target="_blank" className="list-item-btn">
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
            <h2 class="h3">{this.props.item.get('name')} Actions</h2>
          </Grid>
          <Button to="checkCreateRequest" block={true} flat={true} className="text-left" style={{margin:0}} query={{target:{id:this.props.item.get('id')}}}>Create Check</Button>
          {
            // this.getActions().map(a => {
            //   return <Button block={true} flat={true} onClick={this.runAction.bind(null, a)} className="text-left" style={{margin:0}}>{a}</Button>
            // })
          }
        </Modal>
      )
    }
  },
  renderLink(){
    if(!this.props.onClick){
      return(
        <Link to={this.getGroupLink()} params={{id:this.props.item.get('id'), name:this.props.item.get('name')}} className="list-item-link flex-1 align-items-center" style={{maxWidth:'100%'}}>
          <div>
            {this.props.item.get('name')}
            <br/>
            <span className="text-secondary">X of Y passing</span>
          </div>
        </Link>
        );
      }else{
        return (
          <div className="list-item-link" style={{maxWidth:'100%'}}>
            <div>{this.props.item.get('name')}</div>
          </div>
        )
      }
  },
  render(){
    return (
      <div key="listItem" className="list-item" onClick={this.onClick} style={[this.getStyle()]}>
        {this.renderModal()}
        {this.renderGraph()}
        <div className="line-height-1 flex-1 display-flex">
          {this.renderLink()}
          {this.props.linkInsteadOfMenu ? this.renderLinkButton() : this.renderButton()}
        </div>
      </div>
    );
  }
});

export default Radium(GroupItem);