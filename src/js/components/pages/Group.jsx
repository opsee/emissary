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
      hello check {this.props.id}
      </div>
    );
  }
});