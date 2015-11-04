import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import {Record} from 'immutable';
import cx from 'classnames';
import _ from 'lodash';

import ga from '../../modules/ga';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, Modal} from '../global';
import {InstanceActions} from '../../actions';
import {Settings, NewWindow, Refresh, Stop, Play, Delete} from '../icons';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {Padding} from '../layout';

const InstanceItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    selected: PropTypes.string,
    onClick: PropTypes.func,
    noModal: PropTypes.bool,
    noGraph: PropTypes.bool,
    title: PropTypes.string,
    linkInsteadOfMenu: PropTypes.bool
  },
  getInitialState(){
    return _.assign({}, {
      showModal: false
    });
  },
  getInstanceLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `instance${suffix}`;
  },
  isSelected(){
    return this.props.selected && this.props.selected === this.props.item.get('id');
  },
  runMenuOpen(e){
    e.preventDefault();
    ga('send', 'event', 'InstanceItem', 'menu-open');
    this.setState({
      showModal: true
    });
  },
  runAction(action, id){
    InstanceActions.runInstanceAction({id});
  },
  handleHide(){
    ga('send', 'event', 'InstanceItem', 'menu-close');
    this.setState({showModal: false});
  },
  handleClick(e){
    if (typeof this.props.onClick === 'function'){
      e.preventDefault();
      this.props.onClick(this.props.item.get('id'), this.props.item.get('type'));
    }
  },
  renderStatusText(){
    if (this.props.item.get('state') === 'restarting'){
      return <span>:&nbsp;(Restarting)</span>;
    }
    return <span/>;
  },
  renderButton(){
    return (
      <Button icon flat secondary onClick={this.runMenuOpen} title="Instance Menu">
        <Settings fill="textSecondary" btn/>
      </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getInstanceLink()} params={{id: this.props.item.get('id')}} title={`Open ${this.props.item.get('name')} in a New Window`} icon flat target="_blank" className={listItem.btn}>
        <NewWindow btn fill={colors.textColorSecondary}/>
    </Button>
    );
  },
  renderModal(){
    if (!this.props.noModal){
      return (
        <Modal show={this.state.showModal} onHide={this.handleHide} className="context" style="default">
          <Grid fluid>
            <Row>
              <div className="flex-1">
                <Padding lr={1}>
                  <h3>{this.props.item.get('name')} Actions</h3>
                </Padding>
                <Button text="left" color="primary" block flat onClick={this.runAction.bind(null, 'Restart', this.props.item.get('id'))}>
                  <Refresh inline fill="primary"/> Restart
                </Button>
                <Button text="left" color="primary" block flat onClick={this.runAction.bind(null, 'Stop')}>
                  <Stop inline fill="primary"/> Stop
                </Button>
                <Button text="left" color="primary" block flat onClick={this.runAction.bind(null, 'Start')}>
                  <Play inline fill="primary"/> Start
                </Button>
                <Button text="left" color="primary" block flat onClick={this.runAction.bind(null, 'Start')}>
                  <Delete inline fill="primary"/> Terminate
                </Button>
              </div>
            </Row>
          </Grid>
        </Modal>
      );
    }
  },
  renderGraph(){
    if (!this.props.noGraph){
      if (!this.props.onClick){
        return (
          <Link to={this.getInstanceLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} className={listItem.link}>
            <RadialGraph {...this.props.item.toJS()}/>
          </Link>
        );
      }
      return (
        <RadialGraph {...this.props.item.toJS()}/>
      );
    }
    return <div/>;
  },
  renderText(){
    if (!this.props.onClick){
      return (
      <Link to={this.getInstanceLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} className={cx([listItem.link, 'flex-vertical-align', 'flex-1'])}>
        <div>{this.props.item.get('name')}{this.renderStatusText()}</div>
      </Link>
      );
    }
    return (
      <div className={cx([listItem.link, 'flex-vertical-align', 'flex-1'])}>
        <div>{this.props.item.get('name')}{this.renderStatusText()}</div>
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

export default InstanceItem;