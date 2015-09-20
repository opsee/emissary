import React, {PropTypes} from 'react';
import {CheckActions} from '../../actions';
import {Alert, Toolbar} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {CheckStore} from '../../stores';
import {Link} from 'react-router';
import {Edit} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {PageAuth} from '../../modules/statics';

function getState(){
  return {
    check:CheckStore.getCheck()
  }
}

export default React.createClass({
  mixins: [CheckStore.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
  storeDidChange() {
    const status = CheckStore.getGetCheckStatus();
    if(status == 'success'){
      this.setState(getState());
    }else if(status != 'pending'){
      this.setState({error:status})
    }
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
  getLink(){
    const target = this.state.check.get('target');
    if(target.type == 'sg'){
      return (
        <Link to="groupSecuriy" params={{id:target.id}}>{target.name || target.id}</Link>
      )
    }else{
      //elb
      return (
        <Link to="group" params={{id:target.id}}>{target.name || target.id}</Link>
      )
    }
  },
  innerRender(){
    if(!this.state.error && this.state.check && this.state.check.get('id')){
      return(
        <div>
          <h2>Check Information</h2>
          <table className="table">
            <tr>
              <td><strong>Group</strong></td>
              <td>{this.getLink()}</td>
            </tr>
            <tr>
              <td><strong>Path</strong></td>
              <td>{this.state.check.get('path')}</td>
            </tr>
            <tr>
              <td><strong>Port</strong></td>
              <td>{this.state.check.get('port')}</td>
            </tr>
            <tr>
              <td><strong>Protocol</strong></td>
              <td>{this.state.check.get('protocol')}</td>
            </tr>
            <tr>
              <td><strong>Method</strong></td>
              <td>{this.state.check.get('verb')}</td>
            </tr>
          </table>
          {
          // <h2>Check Instances</h2>
          // <ul className="list-unstyled">
          //   {this.state.check.get('instances').map(i => {
          //     return (
          //       <li key={i.get('id')}>
          //         <InstanceItem item={i}/>
          //       </li>
          //       )
          //   })}
          // </ul>
          }
        </div>
      )
    }else if(this.state.error){
      return (
        <Alert type="danger">
          Something went wrong trying to get Check {this.props.params.id}.
        </Alert>
      )
    }
  },
  outputLink(){
    if(this.state.check && this.state.check.get('id')){
      return (
        <Link to="checkEdit" params={{id:this.props.params.id}} className="btn btn-primary btn-fab" title={`Edit ${this.state.check.get('name') || this.props.params.id}`}>
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
        <Toolbar title={`Check ${this.state.check.get('name') || this.props.params.id}`}>
          {this.outputLink()}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              {this.innerRender()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});