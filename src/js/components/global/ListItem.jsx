import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';
import cx from 'classnames';

import {Checkmark, NewWindow} from '../icons';
import {Button} from '../forms';
import style from '../global/listItem.css';
import {Padding} from '../layout';
import RadialGraph from './RadialGraph';
import {
  app as actions,
  analytics as analyticsActions
} from '../../actions';

const ListItem = React.createClass({
  propTypes: {
    children: PropTypes.node,
    item: PropTypes.object,
    link: PropTypes.string,
    linkInsteadOfMenu: PropTypes.bool,
    menuTitle: PropTypes.string,
    onClick: PropTypes.func,
    params: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    noMenu: PropTypes.bool,
    actions: PropTypes.shape({
      openContextMenu: PropTypes.func
    }),
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
    })
  },
  getDefaultProps(){
    return {
      menuTitle: 'Actions',
      type: 'GroupItem'
    };
  },
  runMenuOpen(){
    this.props.actions.openContextMenu(this.props.item.get('id'));
    this.props.analyticsActions.trackEvent(this.props.type, 'menu-open');
  },
  handleClick(e){
    if (typeof this.props.onClick === 'function'){
      if (e){
        e.preventDefault();
      }
      this.props.onClick.call(null, this.props.item);
    }
  },
  renderGraph(){
    const graph = (
      <RadialGraph item={this.props.item} type={this.props.type}/>
    );
    if (this.props.onClick){
      return (
        <div className={style.link} onClick={this.handleClick}>
          {graph}
        </div>
      );
    }
    return (
      <Link to={this.props.link} params={this.props.params} className={style.link}>
       {graph}
      </Link>
    );
  },
  renderInfo(){
    if (this.props.onClick){
      return (
        <div className={cx([style.link, 'display-flex', 'flex-1', 'flex-column'])} onClick={this.handleClick}>
          <div>{_.find(this.props.children, {key: 'line1'})}</div>
          <div className="text-secondary">{_.find(this.props.children, {key: 'line2'})}</div>
        </div>
      );
    }
    return (
      <Link to={this.props.link} params={this.props.params} className={cx([style.link, 'display-flex', 'flex-1', 'flex-column'])} title={this.props.title}>
        <div>{_.find(this.props.children, {key: 'line1'})}</div>
        <div className="text-secondary">{_.find(this.props.children, {key: 'line2'})}</div>
      </Link>
    );
  },
  renderMenuButton(){
    const menu = _.find(this.props.children, {key: 'menu'});
    if (!menu){
      return null;
    }
    if (this.props.onClick){
      return (
        <Button icon flat to={this.props.link} target="_blank" title={`View this ${this.props.type} in a new window`}>
          <NewWindow btn fill="textSecondary"/>
        </Button>
      );
    }
    return null;
  },
  renderSelectButton(){
    const selected = this.props.item.get('selected');
    const fn = this.props.onSelect;
    if (fn && typeof fn === 'function'){
      const icon = selected ? <Checkmark btn fill={seed.color.gray9}/> : null;
      return (
        <div className="display-flex align-items-center justify-content-center">
          <Button icon flat secondary onClick={fn.bind(null, this.props.item.toJS())} title="Select" className={cx(style.selector, selected && style.selectorSelected)}>{icon}</Button>
        </div>
      );
    }
    return null;
  },
  renderMenu(){
    return _.find(this.props.children, {key: 'menu'}) || <div/>;
  },
  render(){
    const item = this.props.item.toJS();
    return (
      <div className={cx(style.item, item.selected && style.itemSelected, style[item.state])}>
        <Padding b={1} className="display-flex">
          {this.renderMenu()}
          <Padding r={2} l={0.5}>
            {this.renderGraph()}
          </Padding>
          <Padding className="flex-1 display-flex" r={0.5}>
            {this.renderInfo()}
          </Padding>
          {this.renderSelectButton()}
        </Padding>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  analyticsActions: bindActionCreators(analyticsActions, dispatch)
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);