import React, {PropTypes} from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/Check';
import Link from 'react-router/lib/components/Link';
import {MoreHoriz} from '../icons/Module.jsx';
import colors from 'seedling/colors';
import Immutable, {Record} from 'immutable';

export default React.createClass({
  propTypes:{
    item:React.PropTypes.instanceOf(Record).isRequired,
  },
  getInitialState() {
    return this.props;
  },
  silence(id){
    return console.log('silence');
    Actions.silence(id);
  },
  render() {
    return (
      <div className="row">
        <div className="col-xs-12 display-flex flex-vertical-align">
          <Link to="instance" params={{id:this.state.item.get('id')}} className="flex-1 display-flex flex-vertical-align link-style-1">
            <RadialGraph {...this.state.item.toJS()}/>
            <div className="padding-tb line-height-1">
              <div>{this.state.item.get('name')}</div>
              <div className="text-secondary">{this.state.item.get('getInfo')}</div>
            </div>
          </Link>
          <button type="button" className="btn btn-icon btn-flat" onClick={this.silence.bind(this,this.state.item.get('id'))} title="Silence Instance">
            <MoreHoriz btn={true}/>
          </button>
        </div>
      </div>
    );
  }
});