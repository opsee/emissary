import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import {Record} from 'immutable';
import ga from '../../modules/ga';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, Modal} from '../global';
import {Settings, NewWindow, Add} from '../icons';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {Padding} from '../layout';
import {GroupStore} from '../../stores';
import cx from 'classnames';

const GroupItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    selected: PropTypes.string,
    onClick: PropTypes.func,
    noModal: PropTypes.bool,
    noGraph: PropTypes.bool,
    title: PropTypes.string,
    linkInsteadOfMenu: PropTypes.bool
  },
  getDefaultProps(){
    return {
      item: GroupStore.getNewGroup()
    };
  },
  getInitialState(){
    return _.assign({}, {
      showModal: false
    });
  },
  getGroupLink(){
    let suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    suffix = suffix.match('Elb') ? 'ELB' : suffix;
    return `group${suffix}`;
  },
  getActions(){
    return ['Create Check'];
  },
  isSelected(){
    return this.props.selected && this.props.selected === this.props.item.get('id');
  },
  runMenuOpen(e){
    e.preventDefault();
    ga('send', 'event', 'GroupItem', 'menu-open');
    this.setState({
      showModal: true
    });
  },
  runAction(action){
    console.log(action);
  },
  runHideContextMenu(){
    ga('send', 'event', 'GroupItem', 'menu-close');
    this.setState({showModal: false});
  },
  handleClick(e){
    if (typeof this.props.onClick === 'function'){
      e.preventDefault();
      this.props.onClick(this.props.item.get('id'), this.props.item.get('type'));
    }
  },
  renderButton(){
    return (
      <Button icon flat secondary onClick={this.runMenuOpen} title="Group Menu">
        <Settings fill="textSecondary" btn/>
      </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getGroupLink()} params={{id: this.props.item.get('id')}} title={`Open ${this.props.item.get('name')} in a New Window`} icon flat target="_blank">
        <NewWindow btn fill="textSecondary"/>
    </Button>
    );
  },
  renderModal(){
    if (!this.props.noModal){
      return (
        <Modal show={this.state.showModal} onHide={this.runHideContextMenu} className="context" style="default">
          <Grid fluid>
            <Row>
              <div className="flex-1">
                <Padding lr={1}>
                  <h3>{this.props.item.get('name')} Actions</h3>
                </Padding>
                <Button color="primary" text="left" to="checkCreateRequest" block flat query={{target: {id: this.props.item.get('id'), type: this.props.item.get('type')}}}>
                  <Add inline fill="primary"/> Create Check
                </Button>
              </div>
            </Row>
          </Grid>
          {
            // this.getActions().map(a => {
            //   return <Button block flat onClick={this.runAction.bind(null, a)} className="text-left" style={{margin: 0}}>{a}</Button>
            // })
          }
        </Modal>
      );
    }
  },
  renderGraph(){
    if (!this.props.noGraph){
      if (!this.props.onClick){
        return (
          <Link to={this.getGroupLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} className={listItem.link}>
            <RadialGraph {...this.props.item.toJS()} type={this.props.item.get('type') === 'security' ? 'Security Group' : 'ELB Group'}/>
          </Link>
        );
      }
      return (
        <div className={listItem.link}>
          <RadialGraph {...this.props.item.toJS()}/>
        </div>
      );
    }
    return <div/>;
  },
  renderText(){
    if (!this.props.onClick){
      return (
      <Link to={this.getGroupLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} className={cx([listItem.link, 'display-flex', 'flex-1', 'flex-column'])}>
        <div>{this.props.item.get('name')}</div>
        <div className="text-secondary">{this.props.item.get('instances').size || this.props.item.get('instance_count')} Instances</div>
      </Link>
      );
    }
    return (
      <div className={cx([listItem.link, 'display-flex', 'flex-1', 'flex-column'])}>
        <div>{this.props.item.get('name')}</div>
        <div className="text-secondary">{this.props.item.get('instances').size || this.props.item.get('instance_count')} Instances</div>
      </div>
    );
  },
  render(){
    if (this.props.item.get('name')){
      return (
        <div key="listItem" className={listItem.item} onClick={this.handleClick} title={this.props.title || this.props.item.get('name')}>
          <Padding b={1}>
            {this.renderModal()}
            <Grid fluid>
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
    }
    return <div/>;
  }
});

export default GroupItem;