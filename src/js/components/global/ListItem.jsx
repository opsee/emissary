import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cx from 'classnames';
import {is} from 'immutable';

import {Checkmark} from '../icons';
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
    onClick: PropTypes.func,
    params: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    onSelect: PropTypes.func,
    actions: PropTypes.shape({
      openContextMenu: PropTypes.func
    }),
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
    }),
    scheme: PropTypes.string
  },
  getDefaultProps(){
    return {
      type: 'GroupItem'
    };
  },
  shouldComponentUpdate(nextProps) {
    let arr = [];
    arr.push(!is(this.props.item, nextProps.item));
    arr.push(nextProps.scheme !== this.props.scheme);
    return _.some(arr);
  },
  getClass(){
    const item = this.props.item.toJS();
    return cx(style.item, {
      [style.itemSelected]: item.selected,
      [style.itemPending]: item.deleting
    }, style[item.state], style[this.props.scheme]);
  },
  runMenuOpen(){
    this.props.actions.openContextMenu(this.props.item.get('id'));
    this.props.analyticsActions.trackEvent(this.props.type, 'menu-open');
  },
  handleSelect(){
    const fn = this.props.onSelect;
    if (typeof fn === 'function'){
      fn.call(null, this.props.item.toJS());
    }
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
        <div className={cx(style.link, style[this.props.scheme])} onClick={this.handleClick}>
          {graph}
        </div>
      );
    }
    return (
      <Link to={this.props.link} params={this.props.params} className={cx(style.link, style[this.props.scheme])}>
       {graph}
      </Link>
    );
  },
  renderInfo(){
    const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
    const line1 = _.find(children, {key: 'line1'});
    const line2 = _.find(children, {key: 'line2'});
    if (this.props.onClick){
      return (
        <div className={cx([style.link, style[this.props.scheme]])} onClick={this.handleClick}>
          <div>{line1}</div>
          {line2 ? <div className="text-secondary text-sm">{null}</div> : null}
        </div>
      );
    }
    return (
      <Link to={this.props.link} params={this.props.params} className={cx([style.link, style[this.props.scheme]])} title={this.props.title}>
        <div>{line1}</div>
        {line2 ? <div className="text-secondary text-sm">{line2}</div> : null}
      </Link>
    );
  },
  renderSelectButton(){
    const selected = this.props.item.get('selected');
    const fn = this.props.onSelect;
    if (fn && typeof fn === 'function'){
      const icon = selected ? <Checkmark btn fill="textSecondary"/> : null;
      return (
        <div className="display-flex align-items-center justify-content-center">
          <Button icon flat onClick={this.handleSelect} title="Select" className={cx(style.selector, selected && style.selectorSelected)}>{icon}</Button>
        </div>
      );
    }
    return null;
  },
  render(){
    return (
      <div className={this.getClass()}>
        <div className="display-flex middle-xs">
          <Padding r={2} l={0.5}>
            {this.renderGraph()}
          </Padding>
          <Padding className="flex-1 display-flex align-items-center" r={0.5} style={{minHeight: '4rem'}}>
            {this.renderInfo()}
          </Padding>
          {this.renderSelectButton()}
        </div>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  analyticsActions: bindActionCreators(analyticsActions, dispatch)
});

const mapStateToProps = (state) => ({
  redux: state,
  scheme: state.app.scheme
});

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);