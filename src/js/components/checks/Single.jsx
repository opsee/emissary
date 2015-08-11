import React, {PropTypes} from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/Check';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';

function getState(){
  return {
    check:Store.getCheck()
  }
}

export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  silence(id){
    Actions.silence(id);
  },
  render() {
    return (
      <div className="bg-body" style={{position:"relative"}}>
        <Toolbar title={`Check ${this.props.check.name || this.props.check.params.id}`}>
          <Link to="checkEdit" params={{id:this.props.check.id}} className="btn btn-primary btn-fab" title="Edit {check.name}">
        edit1
          </Link>
        </Toolbar>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <h2>Check Information</h2>
              <table className="table">
                <tbody>
                {this.props.check.meta.map(i => {
                  return (
                    <tr>
                      <td><strong>{i.key}</strong></td>
                      <td>{i.value}</td>
                    </tr>
                    )
                })}
                </tbody>
              </table>
              <h2>Check Instances</h2>
              <ul className="list-unstyled">
                {this.props.check.instances.map(i => {
                  return (
                    <li key={i.get('id')}>
                      <InstanceItem item={i}/>
                    </li>
                    )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});