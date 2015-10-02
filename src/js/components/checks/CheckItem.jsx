import React from 'react';
import {RadialGraph, ListItem} from '../global';
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
      <div className="display-flex list-item">
        <Link to="check" params={{id:this.props.item.get('id')}} className="link-style-1 flex-1 padding-tb-sm" style={{maxWidth:'100%'}}>
          <ListItem>
            <RadialGraph {...this.props.item.toJS()}/>
            <div className="line-height-1 flex-1">
              <div className="list-item-line">{this.state.item.get('name')}</div>
              {
              // <div className="opsee-list-item-line text-secondary">X of Y passing (N instances)</div>
              }
            </div>
          </ListItem>
        </Link>
        <button type="button" className="btn btn-icon btn-flat btn-secondary" onClick={this.silence.bind(this,this.props.item.get('id'))} title="Check Actions">
          <MoreHoriz inline={true}/>
        </button>
      </div>
    );
  }
});