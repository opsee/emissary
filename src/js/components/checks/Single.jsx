import React, {PropTypes} from 'react';
import _ from 'lodash';
import {List, Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {Edit, Delete} from '../icons';
import {Button} from '../forms';
import {Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import AssertionItemList from './AssertionItemList';
import CheckResponsePaginate from './CheckResponsePaginate';
import NotificationItemList from './NotificationItemList';
import HTTPRequestItem from './HTTPRequestItem';
import {
  checks as actions
} from '../../actions';

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
  getResponses(){
    return _.get(this.getCheck().get('results').get(0), 'responses') || new List();
  },
  runRemoveCheck(){
    this.props.actions.del(this.props.params.id);
  },
  renderNotifications(){
    let notifs = this.getCheck().get('notifications');
    notifs = notifs.toJS ? notifs.toJS() : notifs;
    if (this.getCheck().get('COMPLETE')){
      return (
        <Padding b={1}>
          <Heading level={3}>Notifications</Heading>
          <NotificationItemList notifications={notifs} />
        </Padding>
      );
    }
    return null;
  },
  renderTarget(){
    const target = this.getCheck().get('target');
    if (target && target.type === 'host'){
      return null;
    }
    let el;
    switch (target.type){
    case 'instance':
      el = <InstanceItem target={target}/>;
      break;
    default:
      el = <GroupItem target={target}/>;
      break;
    }
    return (
      <Padding b={1}>
        <Heading level={3}>Target</Heading>
        {el}
      </Padding>
    );
  },
  renderInner(){
    const check = this.getCheck().toJS();
    if (check.name){
      const spec = check.spec;
      const target = check.target;
      let d = _.chain(check.results).head().get('time').value() || new Date();
      if (typeof d === 'number'){
        d = new Date(d * 1000);
      }
      return (
        <div>
          {this.renderTarget()}
          <Padding b={2}>
            <Heading level={3}>HTTP Request</Heading>
            <HTTPRequestItem spec={spec} target={target} />
          </Padding>
          <Padding b={1}>
            <Heading level={3}>Assertions</Heading>
            {check.COMPLETE && <AssertionItemList assertions={check.assertions}/>}
          </Padding>
          <Padding b={2}>
            <CheckResponsePaginate responses={this.getResponses()} date={d}/>
          </Padding>

          {this.renderNotifications()}
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
    return null;
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
              <BastionRequirement>
                <Padding b={3}>
                  {this.renderInner()}
                </Padding>
                <Button onClick={this.runRemoveCheck} flat color="danger">
                  <Delete inline fill="danger"/> Delete Check
                </Button>
              </BastionRequirement>
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
