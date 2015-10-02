import React from 'react';
import {RadialGraph, ListItem} from '../global';
import {CheckActions} from '../../actions';
import {Link} from 'react-router';
import {MoreHoriz, NewWindow} from '../icons';
import colors from 'seedling/colors';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import router from '../../modules/router';

export default React.createClass({
  silence(id){
    CheckActions.silence(id);
  },
  getGroupLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `group${suffix}`;
  },
  renderButton(){
    return (
    <Button icon={true} flat={true} onClick={this.silence.bind(this,this.props.item.get('id'))} title="Silence Group">
        <MoreHoriz btn={true}/>
      </Button>
    );
  },
  linkClick(e){
    e.preventDefault();
    window.open(router.makeHref('groupSecurity', {id:this.props.item.get('id')}))
  },
  renderLinkButton(){
    return (
    <Button to={this.getGroupLink()} params={{id:this.props.item.get('id')}} onClick={this.linkClick} title={`Open ${this.props.item.get('name')} in a New Window`} icon={true} flat={true}>
        <NewWindow btn={true} fill={colors.gray700}/>
    </Button>
    );
  },
  innerRender(link){
    return (
      <ListItem>
        <RadialGraph {...this.props.item.toJS()}/>
        <div className="padding-tb-sm line-height-1 flex-1 align-items-center">
          <div className="list-item-line flex-1">{this.props.item.get('name')}</div>
          {link ? this.renderLinkButton() : null}
          {
          // <div className="text-secondary">X of Y passing (N instances)</div>
          }
        </div>
      </ListItem>
    );
  },
  render() {
    if(!this.props.noLink){
      return(
        <div className="display-flex">
          <Link to={this.getGroupLink()} params={{id:this.props.item.get('id')}} className="link-style-1 flex-1" style={{maxWidth:'100%'}}>
            {this.innerRender()}
          </Link>
        </div>
      )
    }else{
      return (
        <div className="display-flex" style={{cursor:'pointer'}} onClick={this.props.onClick.bind(null, this.props.item.get('id'))}>
          <div className="link-style-1 flex-1" style={{maxWidth:'100%'}}>
            {this.innerRender(true)}
          </div>
        </div>
      )
    }
  }
});