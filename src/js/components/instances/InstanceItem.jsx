import React, {PropTypes} from 'react';
import {RadialGraph, ListItem, Modal} from '../global';
import {CheckActions, GlobalActions, InstanceActions, GroupActions} from '../../actions';
import {Link} from 'react-router';
import {MoreHoriz} from '../icons';
import colors from 'seedling/colors';
import Immutable, {Record} from 'immutable';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';

export default React.createClass({
  propTypes:{
    item:React.PropTypes.instanceOf(Record).isRequired,
  },
  getInitialState() {
    return _.assign({},this.props, {
      showModal:false
    });
  },
  silence(id){
    return console.log('silence');
    CheckActions.silence(id);
  },
  getInstanceLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `instance${suffix}`;
  },
  openMenu(){
    this.setState({
      showModal:true
    });
  },
  getActions(){
    return ['Restart', 'Stop', 'Start', 'Terminate'];
  },
  runAction(action){
    if(action == 'Restart'){
      this.setState({
        statusText:'Restarting'
      })
      this.hideContextMenu();
      const self = this;
      setTimeout(() => {
        InstanceActions.runInstanceAction({
          action:action,
          id:self.state.item.get('id')
        });
        InstanceActions.getInstancesECC();
        GroupActions.getGroupsSecurity();
        self.setState({
          statusText:null
        })
      }, 30000);
    }
  },
  hideContextMenu(){
    this.setState({showModal:false});
  },
  renderStatusText(){
    if(this.state.statusText){
      return <span>:&nbsp;({this.state.statusText})</span>
    }else{
      return <span/>
    }
  },
  render() {
    return (
      <div className="display-flex flex-vertical-align">
      <Modal show={this.state.showModal} onHide={this.hideContextMenu} className="context" style="default">
        <Grid fluid={true}>
          <h2 class="h3">{this.state.item.get('name')} Actions</h2>
        </Grid>
        {this.getActions().map(a => {
          return <Button block={true} flat={true} onClick={this.runAction.bind(null, a)} className="text-left" style={{margin:0}}>{a}</Button>
        })}
      </Modal>
        <Link to={this.getInstanceLink()} params={{id:this.state.item.get('id')}} className="link-style-1 flex-1" style={{maxWidth:'100%'}}>
          <ListItem>
            <RadialGraph {...this.state.item.toJS()}/>
            <div className="padding-tb line-height-1 flex-1">
              <div className="list-item-line">{this.state.item.get('name')}{this.renderStatusText()}</div>
              {
              // <div className="opsee-list-item-line text-secondary">X of Y passing (N instances)</div>
              }
            </div>
          </ListItem>
        </Link>{
          <Button icon={true} flat={true} onClick={this.openMenu} title="Silence Instance">
            <MoreHoriz btn={true}/>
          </Button>
        }
      </div>
    );
  }
});