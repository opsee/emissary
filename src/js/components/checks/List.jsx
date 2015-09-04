import React from 'react';
import {CheckActions} from '../../actions';
import {Toolbar} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {CheckStore} from '../../stores';
import CheckItem from '../checks/CheckItem.jsx';
import {Link} from 'react-router';
import {Add} from '../icons';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';

function getState(){
  return {
    checks:CheckStore.getChecks()
  }
}

export default React.createClass({
  mixins: [CheckStore.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
  storeDidChange() {
    this.setState(getState());
  },
  getInitialState(){
    return getState();
  },
  getData(){
    CheckActions.getChecks();
  },
  componentWillMount(){
    this.getData();
  },
  silence(id){
    CheckActions.silence(id);
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