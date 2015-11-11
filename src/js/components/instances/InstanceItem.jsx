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
/*eslint-disable  no-unused-vars*/
import {Add, Settings, NewWindow, Refresh, Stop, Play, Delete} from '../icons';
/*eslint-enable  no-unused-vars*/
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
  getInfoText(){
    if (this.props.item.get('total')){
      return `${this.props.item.get('passing')} of ${this.props.item.get('total')} passing`;
    }
    return 'No checks applied';
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
      this.props.onClick(this.props.item.get('id'), this.props.item.get('type'), this.props.item.get('name'));
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
                <Button color="primary" text="left" to="checkCreateRequest" block flat query={{target: {id: this.props.item.get('id'), type: this.props.item.get('type'), name: this.props.item.get('name')}}}>
                  <Add inline fill="primary"/> Create Check
                </Button>
                {
                // <Button text="left" color="primary" block flat onClick={this.runAction.bind(null, 'Restart', this.props.item.get('id'))}>
                //   <Refresh inline fill="primary"/> Restart
                // </Button>
                // <Button text="left" color="primary" block flat onClick={this.runAction.bind(null, 'Stop')}>
                //   <Stop inline fill="primary"/> Stop
                // </Button>
                // <Button text="left" color="primary" block flat onClick={this.runAction.bind(null, 'Start')}>
                //   <Play inline fill="primary"/> Start
                // </Button>
                // <Button text="left" color="primary" block flat onClick={this.runAction.bind(null, 'Start')}>
                //   <Delete inline fill="primary"/> Terminate
                // </Button>
                }
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
            <RadialGraph {...this.props.item.toJS()} type="instance"/>
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
      <Link to={this.getInstanceLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} className={cx([listItem.link, 'display-flex', 'flex-1', 'flex-column'])}>
        <div>{this.props.item.get('name')}{this.renderStatusText()}</div>
        <div className="text-secondary">{this.getInfoText()}</div>
      </Link>
      );
    }
    return (
      <div className={cx([listItem.link, 'display-flex', 'flex-1', 'flex-column'])}>
        <div>{this.props.item.get('name')}{this.renderStatusText()}</div>
        <div className="text-secondary">{this.getInfoText()}</div>
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