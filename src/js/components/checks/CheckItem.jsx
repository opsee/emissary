import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';

export default React.createClass({
  getInitialState() {
    return {
      on:false
    }
  },
  silence(id){
    Actions.silence(id);
  },
  handleClick() {
    this.setState({
      on:!this.state.on
    })
  },
  render() {
    return (
      <div className="row">
        <div className="col-xs-12 display-flex flex-vertical-align">
          <a href="/check/{{check.id}}" className="flex-1 display-flex flex-vertical-align link-style-1">
            <RadialGraph {...this.props}/>
            <div className="padding-tb line-height-1">
              <div>{this.props.name}</div>
              <div className="text-secondary">{this.props.getInfo}</div>
            </div>
          </a>
          <button type="button" className="btn btn-icon btn-flat" onClick={this.silence.bind(this,this.props.id)} title="Silence check">
          silence
          </button>
        </div>
      </div>
    );
  }
});