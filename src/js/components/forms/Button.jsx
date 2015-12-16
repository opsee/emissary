import React, {PropTypes} from 'react';
import {Link, History} from 'react-router';
import _ from 'lodash';
import Hammer from 'react-hammerjs';

import {ChevronRight} from '../icons';
import colors from 'seedling/colors';
import cx from 'classnames';
import style from './button.css';

let pressingInterval;

const Button = React.createClass({
  mixins: [History],
  propTypes: {
    flat: PropTypes.bool,
    icon: PropTypes.bool,
    block: PropTypes.bool,
    secondary: PropTypes.bool,
    noPad: PropTypes.bool,
    fab: PropTypes.bool,
    color: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string,
    target: PropTypes.string,
    to: PropTypes.string,
    params: PropTypes.object,
    chevron: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    sm: PropTypes.bool,
    onPressUp: PropTypes.func,
    pressDuration: PropTypes.number
  },
  getDefaultProps(){
    return {
      color: 'default',
      type: 'button',
      pressDuration: 2000
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
    for (const prop in this.props){
      if (this.props[prop]){
        const selector = prop.match('color|text') ? this.props[prop] : prop;
        arr.push(style[`btn${ _.startCase(selector).split(' ').join('')}`]);
      }
    }
    arr.push(this.props.className);
    return cx(arr);
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
  getColorDark(){
    return colors[this.props.color + 'Dark'];
  },
  getStyle(){
    if (this.state.pressing){
      let obj = {};
      if (this.props.flat){
        obj.background = `linear-gradient(to right, ${colors[this.props.color]} ${this.state.pressing}%, transparent 0%)`;
        obj.color = 'white';
      }else {
        obj.background = `linear-gradient(to right, ${this.getColorDark()} ${this.state.pressing}%, ${colors[this.props.color]} 0%)`;
      }
      return _.assign({}, this.props.style, obj);
    }
    return this.props.style;
  },
  runResetInterval(e){
    if (e){
      e.preventDefault();
    }
    clearInterval(pressingInterval);
    pressingInterval = null;
    if (this.isMounted()){
      this.setState({
        pressing: 0
      });
    }
  },
  setPressingPercentage(){
    let percent = (Date.now() - this.state.pressStart) / this.props.pressDuration * 100;
    const pressing = percent > 100 ? 100 : percent;
    if (this.state.pressing){
      if (this.isMounted()){
        return this.setState({
          pressing
        });
      }
    }
    return this.runResetInterval();
  },
  handlePress(){
    if (pressingInterval){
      return this.runResetInterval();
    }
    if (this.isMounted()){
      this.setState({
        pressStart: Date.now(),
        pressing: 1
      });
    }
    pressingInterval = setInterval(this.setPressingPercentage, 40);
  },
  handlePressUp(){
    if (this.state.pressStart && this.state.pressing){
      if (Date.now() - this.state.pressStart > this.props.pressDuration){
        if (typeof this.props.onPressUp === 'function'){
          this.props.onPressUp.call();
        }
      }
    }
    this.runResetInterval();
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
      window.open(this.history.createHref(this.props.to));
    }
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
      this.handlePressUp();
    }
  },
  renderChevron(){
    if (this.props.chevron){
      let fill = colors.textColor;
      if (this.props.disabled){
        fill = colors.textColorSecondary;
      }
      return <ChevronRight inline fill={fill}/>;
    }
  },
  renderInner(){
    return (
      <span>
        {this.props.children}
        {this.renderChevron()}
      </span>
    );
  },
  render(){
    if (this.props.to){
      return (
        <Link {...this.props} className={this.getClass()} onClick={this.handleLinkClick} title={this.props.title}>
          {this.renderInner()}
        </Link>
      );
    }else if (this.props.href){
      return (
        <a className={this.getClass()} onClick={this.props.onClick} href={this.props.href} target={this.props.target} title={this.props.title} style={this.getStyle()}>
          {this.renderInner()}
        </a>
      );
    }else if (this.props.onPressUp){
      return (
        <Hammer onPress={this.handlePress} onPressUp={this.handlePressUp} options={this.getHammerOptions()} onPanStart={this.runResetInterval} onSwipe={this.runResetInterval}>
          <button className={this.getClass()} type={this.props.type} disabled={this.props.disabled} title={this.props.title} style={this.getStyle()} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
            {this.renderInner()}
          </button>
        </Hammer>
      );
    }
    return (
      <button className={this.getClass()} type={this.props.type} onClick={this.handleClick} disabled={this.props.disabled} title={this.props.title} style={this.getStyle()}>
        {this.renderInner()}
      </button>
    );
  }
});

export default Button;