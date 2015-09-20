import React from 'react';
import {RadialGraph} from '../global';
import {CheckActions} from '../../actions';
import {Link} from 'react-router';
import {MoreHoriz} from '../icons';

export default React.createClass({
  getInitialState(){
    return {
      item:this.props.item
    }
  },
  silence(id){
    CheckActions.silence(id);
  },
  render() {
    return (
      <div className="display-flex flex-vertical-align">
        <Link to="check" params={{id:this.props.item.get('id')}} className="flex-1 display-flex flex-vertical-align link-style-1">
          <RadialGraph {...this.props.item.toJS()}/>
          <div className="padding-tb line-height-1">
            <div className="opsee-list-item-line">{this.state.item.get('name')}</div>
            <div className="opsee-list-item-line text-secondary">X of Y passing (N instances)</div>
          </div>
        </Link>
        <button type="button" className="btn btn-icon btn-flat" onClick={this.silence.bind(this,this.props.item.get('id'))} title="Check Actions">
          <MoreHoriz inline={true}/>
        </button>
      </div>
    );
  }
});