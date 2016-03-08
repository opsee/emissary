import React, {PropTypes} from 'react';

import {ChevronUp, ChevronDown} from '../icons';
import {Button} from '../forms';
import style from './expandable.css';

const Expandable = React.createClass({
  propTypes: {
  },
  getInitialState(){
    return {
      open: false
    };
  },
  handleToggle(){
    this.setState({
      open: !this.state.open
    });
  },
  renderButton(){
     if (this.state.open){
      return (
        <Button color="info" onClick={this.handleToggle} className={style.button} title="Collapse">
          <ChevronUp inline/>
        </Button>
      );
    }
    return (
      <Button color="info" onClick={this.handleToggle} className={style.button} title="Expand">
        <ChevronDown inline/>
      </Button>
    );
  },
  render(){
    return (
      <div className={this.state.open ? style.expandableOpen : style.expandable}>
        {this.props.children}
        {this.renderButton()}
      </div>
    );
  }
});

export default Expandable;