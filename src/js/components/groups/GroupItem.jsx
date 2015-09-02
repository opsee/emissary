import React from 'react';
import {RadialGraph} from '../global';
import {CheckActions} from '../../actions';
import Link from 'react-router/lib/components/Link'
import {MoreHoriz} from '../icons';
import colors from 'seedling/colors';

export default React.createClass({
  getInitialState() {
    return this.props;
  },
  silence(id){
    CheckActions.silence(id);
  },
  render() {
    return (
      <div className="row">
        <div className="col-xs-12 display-flex flex-vertical-align">
          <Link to="group" params={{id:this.props.item.get('id')}} className="flex-1 display-flex flex-vertical-align link-style-1">
            <RadialGraph {...this.state.item.toJS()}/>
            <div className="padding-tb line-height-1">
              <div>{this.state.item.get('name')}</div>
              <div className="text-secondary">{this.state.item.get('getInfo')}</div>
            </div>
          </Link>
          <button type="button" className="btn btn-icon btn-flat" onClick={this.silence.bind(this,this.state.item.get('id'))} title="Silence Group">
            <MoreHoriz btn={true}/>
          </button>
        </div>
      </div>
    );
  }
});