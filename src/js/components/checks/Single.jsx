import React, {PropTypes} from 'react';
import {CheckActions} from '../../actions';
import {Toolbar, StatusHandler} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {CheckStore} from '../../stores';
import {Link} from 'react-router';
import {Edit, Mail} from '../icons';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {PageAuth} from '../../modules/statics';
import {Button} from '../forms';
import router from '../../modules/router.js';
import {Delete} from '../icons';

function getState(){
  return {
    check:CheckStore.getCheck(),
    status:CheckStore.getGetCheckStatus()
  }
}

export default React.createClass({
  mixins: [CheckStore.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
  storeDidChange() {
    const delStatus = CheckStore.getDeleteCheckStatus();
    if(delStatus == 'success'){
      router.transitionTo('checks');
    }
    this.setState(getState());
  },
  getInitialState(){
    return getState();
  },
  getData(){
    CheckActions.getCheck(this.props.params.id);
  },
  componentWillMount(){
    this.getData();
  },
  silence(id){
    CheckActions.silence(id);
  },
  getCheckJS(){
    return this.state.check.toJS();
  },
  removeCheck(){
    CheckActions.deleteCheck(this.props.params.id);
  },
  getLink(){
    const target = this.state.check.get('target');
    if(target.type == 'sg'){
      return (
        <Link to="groupSecurity" params={{id:target.id}}>{target.name || target.id}</Link>
      )
    }else{
      //elb
      return (
        <Link to="group" params={{id:target.id}}>{target.name || target.id}</Link>
      )
    }
  },
  innerRender(){
    if(!this.state.error && this.state.check.get('id')){
      return(
        <div>
          <div className="padding-b">
            <h3>Check Information</h3>
            <table className="table">
              <tr>
                <td><strong>Group</strong></td>
                <td>{this.getLink()}</td>
              </tr>
              <tr>
                <td><strong>Path</strong></td>
                <td>{this.getCheckJS().check_spec.value.path}</td>
              </tr>
              <tr>
                <td><strong>Port</strong></td>
                <td>{this.getCheckJS().check_spec.value.port}</td>
              </tr>
              <tr>
                <td><strong>Protocol</strong></td>
                <td>{this.getCheckJS().check_spec.value.protocol}</td>
              </tr>
              <tr>
                <td><strong>Method</strong></td>
                <td>{this.getCheckJS().check_spec.value.verb}</td>
              </tr>
            </table>
          </div>
          <div className="padding-b">
            <h3>Notifications</h3>
            {this.state.check.get('notifications').map(n => {
              return(
                <div className="list-item">
                  <div className="list-item-avatar">
                    <Mail className="list-item-icon"/>
                  </div>
                  <div>
                    <span className="text-secondary">Mail:</span><br/>
                    {n.value}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="padding-b">
            <h3>Assertions</h3>
            {this.state.check.get('assertions').map(a => {
              return(
                <div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td><strong>Key</strong></td>
                        <td>{a.key}</td>
                      </tr>
                      <tr>
                        <td><strong>Relationship</strong></td>
                        <td>{a.relationship}</td>
                      </tr>
                      <tr>
                        <td><strong>Value</strong></td>
                        <td>{a.operand}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
        </div>
      )
    }else{
      return (
        <StatusHandler status={this.state.status}>
          <h3>No Checks Applied</h3>
        </StatusHandler>
      );
    }
  },
  outputLink(){
    if(this.state.check && this.state.check.get('id')){
      return (
        <Link to="checkEdit" params={{id:this.props.params.id}} className="btn btn-primary btn-fab" title={`Edit ${this.state.check.name}`}>
          <Edit btn={true}/>
        </Link>
      )
    }else{
      return <span/>
    }
  },
  render() {
    return (
      <div>
        <Toolbar title={`Check ${this.state.check.name}`}>
          {this.outputLink()}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12} display-flex>
              <div className="padding-tb">
                {this.innerRender()}
              </div>
              <hr/>
              <div className="padding-b-md">
                <Button className="pull-right" onClick={this.removeCheck} flat={true} bsStyle="danger"><Delete className="icon"/> Delete Check</Button>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});