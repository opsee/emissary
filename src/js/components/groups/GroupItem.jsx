import React from 'react';
import {RadialGraph, ListItem} from '../global';
import {CheckActions} from '../../actions';
import Link from 'react-router/lib/components/Link'
import {MoreHoriz} from '../icons';
import colors from 'seedling/colors';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import router from '../../modules/router';

export default React.createClass({
  getInitialState() {
    return this.props;
  },
  silence(id){
    CheckActions.silence(id);
  },
  getGroupLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `group${suffix}`;
  },
  outerRender(){
    if(!this.props.noLink){
    }
  },
  innerRender(){
    return (
      <ListItem>
        <RadialGraph {...this.state.item.toJS()}/>
        <div className="padding-tb line-height-1 flex-1">
          <div className="list-item-line">{this.state.item.get('name')}</div>
          {
          // <div className="text-secondary">X of Y passing (N instances)</div>
          }
        </div>
      </ListItem>
    );
  },
  renderButton(){
    return (
    <Button icon={true} flat={true} onClick={this.silence.bind(this,this.state.item.get('id'))} title="Silence Group">
        <MoreHoriz btn={true}/>
      </Button>
    );
  },
  renderLinkButton(){
    return (
    <Link to={this.getGroupLink()} params={{id:this.props.item.get('id')}} onClick={this.linkClick}>
      <Button icon={true} flat={true}>
        <MoreHoriz btn={true}/>
      </Button>
    </Link>
    );
  },
  linkClick(e){
    e.preventDefault();
    window.open(router.makeHref('groupSecurity', {id:this.props.item.get('id')}))
  },
  render() {
    if(!this.props.noLink){
      return(
        <div className="display-flex">
          <Link to={this.getGroupLink()} params={{id:this.props.item.get('id')}} className="link-style-1 flex-1" style={{maxWidth:'100%'}}>
            {this.innerRender()}
          </Link>
          {
            // this.renderButton()
          }
        </div>
      )
    }else{
      return (
        <div className="display-flex">
          <div className="link-style-1 flex-1" style={{maxWidth:'100%'}}>
            {this.innerRender()}
          </div>
          {this.renderLinkButton()}
        </div>
      )
    }
  }
});