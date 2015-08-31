import React from 'react';
import Actions from '../../actions/Check';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/Check';
import CheckItem from '../checks/CheckItem.jsx';
import Link from 'react-router/lib/components/Link';
import {Add} from '../icons/Module.jsx';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col } from '../../modules/bootstrap';

function getState(){
  return {
    checks:Store.getChecks()
  }
}

export default React.createClass({
  mixins: [Store.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
  storeDidChange() {
    this.setState(getState());
  },
  getInitialState(){
    return getState();
  },
  silence(id){
    Actions.silence(id);
  },
  renderChecks(){
    if(this.state.checks.size){
      return(
        <ul className="list-unstyled">
        {this.state.checks.map(c => {
          return (
            <li key={c.get('id')}>
              <CheckItem item={c}/>
            </li>
            )
        })}
      </ul>
      )
    }else{
      return (
        <p>No Checks - <Link to="checkCreate" title="Create New Check">Create One</Link></p>
      );
    }
  },
  render() {
    return (
      <div>
        <Toolbar title="All Checks">
          <Link to="checkCreate" className="btn btn-primary btn-fab" title="Create New Check">
            <Add btn={true}/>
          </Link>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              {this.renderChecks()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});