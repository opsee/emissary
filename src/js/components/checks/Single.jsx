import React, {PropTypes} from 'react';
import {CheckActions} from '../../actions';
import {Toolbar} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {CheckStore} from '../../stores';
import {Link} from 'react-router';
import {Edit} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';

function getState(){
  return {
    check:CheckStore.getCheck()
  }
}

export default React.createClass({
  mixins: [CheckStore.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  silence(id){
    CheckActions.silence(id);
  },
  render() {
    return (
      <div className="bg-body" style={{position:"relative"}}>
        <Toolbar title={`Check ${this.props.check.get('name') || this.props.check.get('id')}`}>
          <Link to="checkEdit" params={{id:this.props.check.get('id')}} className="btn btn-primary btn-fab" title={`Edit ${this.props.check.get('name')}`}>
            <Edit btn={true}/>
          </Link>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <h2>Check Information</h2>
              <table className="table">
                <tbody>
                {this.props.check.get('meta').map(i => {
                  return (
                    <tr>
                      <td><strong>{i.get('key')}</strong></td>
                      <td>{i.get('value')}</td>
                    </tr>
                    )
                })}
                </tbody>
              </table>
              <h2>Check Instances</h2>
              <ul className="list-unstyled">
                {this.props.check.get('instances').map(i => {
                  return (
                    <li key={i.get('id')}>
                      <InstanceItem item={i}/>
                    </li>
                    )
                })}
              </ul>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});