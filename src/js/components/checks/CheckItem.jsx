import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Link from 'react-router/lib/components/Link';

export default React.createClass({
  getInitialState(){
    return {
      item:this.props.item
    }
  },
  silence(id){
    Actions.silence(id);
  },
  render() {
    return (
      <div className="row">
        <div className="col-xs-12 display-flex flex-vertical-align">
          <Link to="check" params={{id:this.props.item.get('id')}} className="flex-1 display-flex flex-vertical-align link-style-1">
            <RadialGraph {...this.props.item.toJS()}/>
            <div className="padding-tb line-height-1">
              <div>{this.props.item.get('name')}</div>
              <div className="text-secondary">{this.props.item.get('getInfo')}</div>
            </div>
          </Link>
          <button type="button" className="btn btn-icon btn-flat" onClick={this.silence.bind(this,this.props.item.get('id'))} title="Silence check">
          silence
          </button>
        </div>
      </div>
    );
  }
});