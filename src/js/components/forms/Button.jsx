import React, {PropTypes} from 'react';
import {ChevronRight} from '../icons';
import colors from 'seedling/colors';
import {Link} from 'react-router';
import router from '../../modules/router';
import cx from 'classnames';
import style from './button.css';

const Button = React.createClass({
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
    sm: PropTypes.bool
  },
  getDefaultProps(){
    return {
      color: 'default',
      type: 'button'
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
  handleLinkClick(e){
    if (this.props.target && this.props.target === '_blank'){
      e.preventDefault();
      e.stopPropagation();
      window.open(router.makeHref(this.props.to, this.props.params));
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
        <a className={this.getClass()} onClick={this.props.onClick} href={this.props.href} target={this.props.target} title={this.props.title} style={this.props.style}>
          {this.renderInner()}
        </a>
      );
    }
    return (
      <button className={this.getClass()} type={this.props.type} onClick={this.props.onClick} disabled={this.props.disabled} title={this.props.title} style={this.props.style}>
        {this.renderInner()}
      </button>
    );
  }
});

export default Button;