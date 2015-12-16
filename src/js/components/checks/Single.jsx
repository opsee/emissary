import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Toolbar, StatusHandler} from '../global';
import {GroupItem} from '../groups';
import {Edit, Delete, Mail} from '../icons';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import AssertionItemList from './AssertionItemList';
import CheckResponsePaginate from './CheckResponsePaginate';
import {checks as actions} from '../../actions';

const CheckSingle = React.createClass({
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getCheck: PropTypes.func.isRequired,
      del: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      checks: PropTypes.object,
      asyncActions: PropTypes.shape({
        getCheck: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.actions.getCheck(this.props.params.id);
  },
  getCheck(){
    return this.props.redux.checks.checks.find(c => {
      return c.get('id') === this.props.params.id;
    }) || new Map({id: this.props.params.id});
  },
  getLink(){
    const group = this.getCheck().get('target');
    return (
      <span>{group.name || group.id}</span>
    );
  },
  getResponses(){
    return _.get(this.getCheck().get('results').get(0), 'responses');
    // const results = this.getCheck().get('results').toJS();
    // if (results && results.length){
    //   const failing = _.filter(results, r => {
    //     return !r.passing;
    //   });
    //   return failing.length ? new List(failing[0].responses) : new List(results[0].responses);
    // }
    // return new List();
  },
  getSingleResponse(){
    const data = this.getResponses();
    let val;
    if (data && data.size){
      let response = this.getResponses().toJS();
      if (response && response.length){
        val = _.get(response[0], 'response.value');
      }
    }
    return val;
  },
  runRemoveCheck(e){
    e.preventDefault();
    this.props.actions.del(this.props.params.id);
  },
  renderInner(){
    if (this.getCheck().get('name')){
      const spec = this.getCheck().get('check_spec').value;
      return (
        <div>
          <Padding b={1}>
            <h3>Target</h3>
            <GroupItem target={this.getCheck().get('target')}/>
          </Padding>
          <Padding b={1}>
            <h3>HTTP Request</h3>
            <Alert bsStyle="default" style={{wordBreak: 'break-all'}}>
              <strong>{spec.verb}</strong> http://{this.getLink()}:<span>{spec.port}</span>{spec.path}
            </Alert>
          </Padding>
          <Padding b={1}>
            <CheckResponsePaginate responses={this.getResponses()}/>
          </Padding>
          <Padding b={1}>
            <h3>Assertions</h3>
            <AssertionItemList assertions={this.getCheck().get('assertions')}/>
          </Padding>
          <Padding b={1}>
            <h3>Notifications</h3>
            <ul className="list-unstyled">
            {this.getCheck().get('notifications').map((n, i) => {
              return (
                <li key={`notif-${i}`}><Mail fill="text" inline/> {n.value}</li>
              );
            })}
            </ul>
          </Padding>
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getCheck.status}/>
    );
  },
  renderLink(){
    if (this.getCheck() && this.getCheck().get('id')){
      return (
        <Button to={`/check/edit/${this.props.params.id}`} color="info" fab title={`Edit ${this.getCheck().get('name')}`}>
          <Edit btn/>
        </Button>
      );
    }
    return <span/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={this.getCheck().get('name') || this.getCheck().get('id') || ''}>
          {this.renderLink()}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={3}>
                {this.renderInner()}
              </Padding>
              <Button onClick={this.runRemoveCheck} flat color="danger">
                <Delete inline fill="danger"/> Delete Check
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(CheckSingle);