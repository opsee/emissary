import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import {Record} from 'immutable';
import cx from 'classnames';
import _ from 'lodash';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, Modal} from '../global';
import {Edit, Settings, NewWindow} from '../icons';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {Padding} from '../layout';

const CheckItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    selected: PropTypes.string,
    onClick: PropTypes.func,
    noGraph: PropTypes.bool,
    noModal: PropTypes.bool,
    linkInsteadOfMenu: PropTypes.bool,
    title: PropTypes.string
  },
  getInitialState(){
    return _.assign({}, {
      showModal: false
    });
  },
  getLink(){
    return 'check';
  },
  getActions(){
    return ['Test'];
  },
  isSelected(){
    return this.props.selected && this.props.selected === this.props.item.get('id');
  },
  runMenuOpen(e){
    e.preventDefault();
    this.setState({
      showModal: true
    });
  },
  runAction(action){
    console.log(action);
  },
  runHideContextMenu(){
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
    <Button icon flat secondary onClick={this.runMenuOpen} title="Check Menu">
      <Settings fill="textSecondary" btn/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getLink()} params={{id: this.props.item.get('id')}} title={`Open ${this.props.item.get('check_spec').value.name} in a New Window`} icon flat target="_blank" className={listItem.btn}>
        <NewWindow btn fill={colors.textColorSecondary}/>
    </Button>
    );
  },
  renderGraph(){
    if (!this.props.noGraph){
      if (!this.props.onClick){
        return (
          <Link to={this.getLink()}  params={{id: this.props.item.get('id'), name: this.props.item.get('check_spec').value.name}} className={listItem.link}>
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
        <Link to={this.getLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('check_spec').value.name}} className={cx([listItem.link, 'flex-vertical-align', 'flex-1'])}>
          <div>{this.props.item.get('check_spec').value.name}</div>
        </Link>
      );
    }
    return (
      <div className="flex-vertical-align flex-1">
        <div>{this.props.item.get('check_spec').value.name}</div>
      </div>
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
                  <h3>{this.props.item.get('check_spec').value.name} Actions</h3>
                </Padding>
                <Button text="left" color="primary" block flat to="checkEdit"  params={{id: this.props.item.get('id')}}>
                  <Edit inline fill="primary"/> Edit
                </Button>
              </div>
            </Row>
          </Grid>
        </Modal>
      );
    }
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

export default CheckItem;