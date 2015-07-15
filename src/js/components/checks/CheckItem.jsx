import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';

export default React.createClass({
  getInitialState() {
    return {
      on:false
    }
  },
  silence(check){
    Actions.silence(check);
  },
  handleClick() {
    this.setState({
      on:!this.state.on
    })
  },
  render() {
    const check = this.props.check;
    return (
      <div className="row">
        <div className="col-xs-12 display-flex flex-vertical-align">
          <a href="/check/{{check.id}}" className="flex-1 display-flex flex-vertical-align link-style-1">
            <RadialGraph item={check}/>
            <div className="padding-tb line-height-1">
              <div>{check.name}</div>
              <div className="text-secondary">{check.getInfo}</div>
            </div>
          </a>
          <button type="button" className="btn btn-icon btn-flat" onClick={this.silence.bind(this,check)} title="Silence check">
          silence
          </button>
        </div>
      </div>
    );
  }
});