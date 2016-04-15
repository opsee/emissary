import React, {PropTypes} from 'react';
import style from './radio.css';
import cx from 'classnames';

const Radio = React.createClass({
  propTypes: {
    on: PropTypes.bool.isRequired,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  },
  handleClick(e) {
    e.preventDefault();
    this.props.onChange.call(null, this.props.id);
  },
  renderLabel(){
    if (this.props.label){
      return <div className={cx(style.label, {[style.labelActive]: this.props.on})} onClick={this.handleClick}  dangerouslySetInnerHTML={{__html: this.props.label}}/>;
    }
    return null;
  },
  render(){
    return (
      <div className={style.wrapper}>
        <button className={this.props.on ? style.radioActive : style.radio} type="button" onClick={this.handleClick} id={this.props.id}/>
        {this.renderLabel()}
      </div>
    );
  }
});

export default Radio;