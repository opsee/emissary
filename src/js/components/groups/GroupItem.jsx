import React, {PropTypes} from 'react';
import {Link} from 'react-router';
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
import cx from 'classnames';
// import colors from '../global/colors.css';

const GroupItem = React.createClass({
  propTypes: {
    item: React.PropTypes.instanceOf(Record).isRequired
  },
  getDefaultProps(){
    return {
      item: GroupStore.getNewGroup()
    }
  },
  getInitialState(){
    return _.assign({}, {
      showModal: false
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
      showModal: true
    });
  },
  getActions(){
    return ['Create Check'];
  },
  runAction(action){
  },
  hideContextMenu(){
    this.setState({showModal: false});
  },
  onClick(e){
    if (typeof this.props.onClick == 'function'){
      e.preventDefault();
      this.props.onClick(this.props.item.get('id'), this.props.item.get('type'));
    }
  },
  renderButton(){
    return (
    <Button icon={true} flat={true} onClick={this.openMenu} title="Group Menu">
      <Settings fill="textSecondary" btn={true}/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getGroupLink()} params={{id: this.props.item.get('id')}} title={`Open ${this.props.item.get('name')} in a New Window`} icon={true} flat={true} target="_blank">
        <NewWindow btn={true} fill="textSecondary"/>
    </Button>
    );
  },
  renderModal(){
    if (!this.props.noModal){
      return (
        <Modal show={this.state.showModal} onHide={this.hideContextMenu} className="context" style="default">
          <Grid fluid={true}>
            <Row>
              <div className="flex-1">
                <Padding lr={1}>
                  <h3>{this.props.item.get('name')} Actions</h3>
                </Padding>
                <Button color="primary" text="left" to="checkCreateRequest" block={true} flat={true} query={{target: {id: this.props.item.get('id'), type: this.props.item.get('type')}}}>
                  <Add inline={true} fill="primary"/> Create Check
                </Button>
              </div>
            </Row>
          </Grid>
          {
            // this.getActions().map(a => {
            //   return <Button block={true} flat={true} onClick={this.runAction.bind(null, a)} className="text-left" style={{margin: 0}}>{a}</Button>
            // })
          }
        </Modal>
      )
    }
  },
  renderGraph(){
    if (!this.props.noGraph){
      if (!this.props.onClick){
        return (
          <Link to={this.getGroupLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} className={listItem.link}>
            <RadialGraph {...this.props.item.toJS()}/>
          </Link>
        )
      }else{
        return (
          <div className={listItem.link}>
            <RadialGraph {...this.props.item.toJS()}/>
          </div>
        )
      }
    }else{
      return <div/>
    }
  },
  renderText(){
    if (!this.props.onClick){
      return (
      <Link to={this.getGroupLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} className={cx([listItem.link, 'display-flex', 'flex-1', 'flex-column'])}>
        <div>{this.props.item.get('name')}</div>
        <div className="text-secondary">{this.props.item.get('instances').size} Instances</div>
      </Link>
      )
    }else{
      return (
        <div className={cx([listItem.link, 'display-flex', 'flex-1', 'flex-column'])}>
          <div>{this.props.item.get('name')}</div>
          <div className="text-secondary">{this.props.item.get('instances').size} Instances</div>
        </div>
      )
    }
  },
  render(){
    if (this.props.item.get('name')){
      return (
        <div key="listItem" className={listItem.item} onClick={this.onClick} title={this.props.title || this.props.item.get('name')}>
          <Padding b={1}>
            {this.renderModal()}
            <Grid fluid={true}>
              <Row>
                <Col xs={2} sm={1}>
                  {this.renderGraph()}
                </Col>
                <Col xs={8} sm={10} className="display-flex">
                  {this.renderText()}
                </Col>
                <Col xs={2} sm={1}>
                  <Row className="end-xs">
                    <Col>
                      {this.props.linkInsteadOfMenu ? this.renderLinkButton() : this.renderButton()}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Grid>
          </Padding>
        </div>
      );
    }else{
      return <div/>
    }
  }
});

export default GroupItem;