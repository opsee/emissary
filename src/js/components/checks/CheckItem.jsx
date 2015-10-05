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

const styles = {
  listItem:{
    cursor:'pointer',
    overflow:'hidden',
    transition:'300ms background',
    borderBottom:`1px solid ${colors.gray800}`,
    ':hover':{
      background:colors.gray800
    }
  },
  listItemNotSelected:{
    opacity:.2
  }
}

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
  renderButton(){
    return (
    <Button icon={true} flat={true} onClick={this.openMenu} title="Group Menu">
        <MoreHoriz btn={true}/>
      </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getGroupLink()} params={{id:this.props.item.get('id')}} title={`Open ${this.props.item.get('name')} in a New Window`} icon={true} flat={true} target="_blank">
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
  innerRender(link){
    return (
      <div className="align-items-center">
        <Modal show={this.state.showModal} onHide={this.hideContextMenu} className="context" style="default">
          <Grid fluid={true}>
            <h2 class="h3">{this.props.item.get('name')} Actions</h2>
          </Grid>
          {
            this.getActions().map(a => {
              return <Button block={true} flat={true} onClick={this.runAction.bind(null, a)} className="text-left" style={{margin:0}}>{a}</Button>
            })
          }
        </Modal>
        {this.renderGraph()}
        <div className="line-height-1 flex-1 align-items-center">
          <div className="list-item-line flex-1">
            {this.props.item.get('check_spec').value.name}
          </div>
          {link ? this.renderLinkButton() : this.renderButton()}
          {
          // <div className="text-secondary">X of Y passing (N instances)</div>
          }
        </div>
      </div>
    );
  },
  render() {
    if(!this.props.noLink){
      return(
        <div key="listItem" style={[styles.listItem, this.props.selected ? styles.listItemSelected : null, this.props.notSelected ? styles.listItemNotSelected : null]}>
          <Link to="check" params={{id:this.props.item.get('id')}} className="link-style-1 flex-1" style={{maxWidth:'100%'}}>
            {this.innerRender()}
          </Link>
        </div>
      )
    }else{
      return (
        <div onClick={this.props.onClick.bind(null, this.props.item.get('id'))} key="listItem" style={[styles.listItem, this.props.selected ? styles.listItemSelected : null, this.props.notSelected ? styles.listItemNotSelected : null]} className="flex-1 link-style-1 align-items-center">
          <div className="link-style-1 flex-1" style={{maxWidth:'100%'}}>
            {this.innerRender(true)}
          </div>
        </div>
      )
    }
  }
});

export default Radium(CheckItem);