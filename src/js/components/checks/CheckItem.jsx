import React from 'react';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import {Record} from 'immutable';
import cx from 'classnames';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph, Modal} from '../global';
import {Settings, NewWindow, Refresh} from '../icons';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {Padding} from '../layout';

const CheckItem = React.createClass({
  propTypes: {
    item: React.PropTypes.instanceOf(Record).isRequired
  },
  getInitialState(){
    return _.assign({}, {
      showModal: false
    });
  },
  actions(e, id){
    e.preventDefault();
    console.log(this.props.item.get('id'));
  },
  getLink(){
    return 'check';
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
    return ['Test'];
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
    <Button icon={true} flat={true} onClick={this.openMenu} title="Check Menu">
      <Settings fill={colors.textColorSecondary} btn={true}/>
    </Button>
    );
  },
  renderLinkButton(){
    return (
    <Button to={this.getLink()} params={{id: this.props.item.get('id')}} title={`Open ${this.props.item.get('check_spec').value.name} in a New Window`} icon={true} flat={true} target="_blank" className={listItem.btn}>
        <NewWindow btn={true} fill={colors.textColorSecondary}/>
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
        )
      }else{
        return (
          <RadialGraph {...this.props.item.toJS()}/>
        )
      }
    }else{
      return <div/>
    }
  },
  renderText(){
    if (!this.props.onClick){
      return (
      <Link to={this.getLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('check_spec').value.name}} className={cx([listItem.link, 'flex-vertical-align', 'flex-1'])}>
        <div>{this.props.item.get('check_spec').value.name}</div>
      </Link>
      )
    }else{
      return (
        <div className="flex-vertical-align flex-1">
          <div>{this.props.item.get('check_spec').value.name}</div>
        </div>
      )
    }
  },
  renderModal(){
    if (!this.props.noModal){
      return (
        <Modal show={this.state.showModal} onHide={this.hideContextMenu} className="context" style="default">
          <Grid fluid={true}>
            <Row>
              <div className="flex-1">
                <Padding lr={1}>
                  <h3>{this.props.item.get('check_spec').value.name} Actions</h3>
                </Padding>
                <Button text="left" color="primary" block={true} flat={true} onClick={this.runAction.bind(null, 'Test')}>
                  <Refresh inline={true} fill="primary"/> Test
                </Button>
              </div>
            </Row>
          </Grid>
        </Modal>
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

export default CheckItem;