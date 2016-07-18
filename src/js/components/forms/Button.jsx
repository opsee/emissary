import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import Hammer from 'react-hammerjs';
import {connect} from 'react-redux';

import {ChevronRight} from '../icons';
import cx from 'classnames';
import style from './button.css';

const pressDuration = 1500;

const Button = React.createClass({
  propTypes: {
    flat: PropTypes.bool,
    icon: PropTypes.bool,
    block: PropTypes.bool,
    secondary: PropTypes.bool,
    fab: PropTypes.bool,
    color: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string,
    target: PropTypes.string,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    query: PropTypes.object,
    chevron: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    sm: PropTypes.bool,
    onPressUp: PropTypes.func,
    scheme: PropTypes.string
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  getDefaultProps(){
    return {
      color: 'default',
      type: 'button'
    };
  },
  getInitialState() {
    return {
      pressStart: false,
      pressing: false
    };
  },
  getClass(){
    let arr = [];
    arr.push(style.btn);
    for (const prop in this.props){
      if (this.props[prop]){
        const selector = prop.match('color|text') ? this.props[prop] : prop;
        arr.push(style[`${ _.lowerCase(selector).split(' ').join('')}`]);
      }
    }
    arr.push(this.props.className);
    arr.push(style[this.props.scheme]);
    return cx(arr);
  },
  getProgressClass(){
    const pressing = this.state.pressing ? 'Pressing' : '';
    return cx(style.progress, style[this.props.color], pressing && style.pressing);
  },
  getInnerClass(){
    return this.props.onPressUp ? style.inner : '';
  },
  getHammerOptions(){
    return {
      recognizers: {
        press: {
          time: 200,
          threshold: 300
        }
      }
    };
  },
  runResetPressing(){
    if (this.isMounted()){
      this.setState({
        pressing: 0
      });
    }
  },
  handlePress(){
    if (this.state.pressing){
      return this.runResetPressing();
    }
    if (this.isMounted()){
      this.setState({
        pressStart: Date.now(),
        pressing: 1
      });
    }
    return null;
  },
  handlePressUp(){
    if (this.state.pressStart && this.state.pressing){
      if (Date.now() - this.state.pressStart > pressDuration){
        if (typeof this.props.onPressUp === 'function'){
          this.props.onPressUp.call();
        }
      }
    }
    this.runResetPressing();
  },
  handleClick(){
    if (typeof this.props.onClick === 'function'){
      this.props.onClick();
    }
  },
  handleLinkClick(e){
    if (this.props.target && this.props.target === '_blank'){
      e.preventDefault();
      e.stopPropagation();
      window.open(this.context.router.createHref(this.props.to));
    }
    this.handleClick();
  },
  handleKeyDown(e){
    if (e.keyCode.toString().match('13|32')){
      if (!this.state.pressing){
        this.handlePress();
      }
    }
  },
  handleKeyUp(e){
    if (e.keyCode.toString().match('13|32')){
      return this.handlePressUp();
    }
    return null;
  },
  renderChevron(){
    if (this.props.chevron){
      return <ChevronRight inline fill="white"/>;
    }
    return null;
  },
  renderInner(){
    return (
      <span className={this.getInnerClass()}>
        {this.props.children}
        {this.renderChevron()}
      </span>
    );
  },
  render(){
    if (this.props.to){
      return (
        <Link {..._.pick(this.props, ['title', 'style', 'target', 'href', 'query', 'to', 'location'])} className={this.getClass()} onClick={this.handleLinkClick}>
          {this.renderInner()}
        </Link>
      );
    } else if (this.props.href){
      return (
        <a className={this.getClass()} onClick={this.props.onClick} href={this.props.href} target={this.props.target} title={this.props.title} style={this.props.style}>
          {this.renderInner()}
        </a>
      );
    } else if (this.props.onPressUp){
      return (
        <Hammer onPress={this.handlePress} onPressUp={this.handlePressUp} options={this.getHammerOptions()} onPanStart={this.runResetPressing} onSwipe={this.runResetPressing}>
          <button className={this.getClass()} type={this.props.type} disabled={this.props.disabled} title={this.props.title} style={this.props.style} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
            <span className={this.getProgressClass()}/>
            {this.renderInner()}
          </button>
        </Hammer>
      );
    }
    return (
      <button className={this.getClass()} type={this.props.type} onClick={this.handleClick} disabled={this.props.disabled} title={this.props.title} style={this.props.style}>
        {this.renderInner()}
      </button>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Button);