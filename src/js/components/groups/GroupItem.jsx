import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import Immutable, {Record} from 'immutable';

import router from '../../modules/router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, ListItem, Modal} from '../global';
import {CheckActions} from '../../actions';
import {Settings, NewWindow, Add} from '../icons';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {Padding} from '../layout';
import {GroupStore} from '../../stores';

const GroupItem = React.createClass({
  propTypes:{
    item:React.PropTypes.instanceOf(Record).isRequired,
  },
  getDefaultProps(){
    return {
      item:GroupStore.getNewGroup()
    }
  },
  getInitialState(){
    return _.assign({},{
      showModal:false
    });
  },
  actions(e, id){
    e.preventDefault();
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
      <Settings fill={colors.textColorSecondary} btn={true}/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getGroupLink()} params={{id:this.props.item.get('id')}} title={`Open ${this.props.item.get('name')} in a New Window`} icon={true} flat={true} target="_blank" className="btn btn-icon btn-secondary">
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
                <Button className="text-left btn-primary" to="checkCreateRequest" block={true} flat={true} query={{target:{id:this.props.item.get('id'), type:this.props.item.get('type')}}}>
                  <Add className="icon"/> Create Check
                </Button>
              </div>
            </Row>
          </Grid>
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
        <Link to={this.getGroupLink()} params={{id:this.props.item.get('id'), name:this.props.item.get('name')}} className={listItem.link} style={{maxWidth:'100%'}}>
          {this.renderGraph()}
          <div>
            <div>{this.props.item.get('name')}</div>
            <div className="text-secondary">{this.props.item.get('instances').size} Instances</div>
          </div>
        </Link>
        );
      }else{
        return (
          <div className={listItem.link} style={{maxWidth:'100%'}}>
          {this.renderGraph()}
          <div>
            <div>{this.props.item.get('name')}</div>
            <div className="text-secondary">{this.props.item.get('instances').size} Instances</div>
          </div>
        </div>
        )
      }
  },
  render(){
    if(this.props.item.get('name')){
      return (
      <div key="listItem" className={listItem.item} onClick={this.onClick} style={[this.getStyle()]} title={this.props.title || this.props.item.get('name')}>
        {this.renderModal()}
        <div className="line-height-1 flex-1 display-flex">
          {this.renderLink()}
          {this.props.linkInsteadOfMenu ? this.renderLinkButton() : this.renderButton()}
        </div>
      </div>
      )
    }else{
      return <div/>
    }
  }
});

export default GroupItem;