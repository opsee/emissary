import React, {PropTypes} from 'react';
import _ from 'lodash';
import {List, Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {Edit, Delete} from '../icons';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import AssertionItemList from './AssertionItemList';
import CheckResponsePaginate from './CheckResponsePaginate';
import {checks as actions} from '../../actions';
import NotificationItemList from './NotificationItemList';

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
    return _.get(this.getCheck().get('results').get(0), 'responses') || new List();
  },
  runRemoveCheck(){
    this.props.actions.del(this.props.params.id);
  },
  renderNotifications(){
    let notifs = this.getCheck().get('notifications');
    notifs = notifs.toJS ? notifs.toJS() : notifs;
    if (notifs.length){
      return (
        <Padding b={1}>
          <h3>Notifications</h3>
          <NotificationItemList notifications={notifs} />
        </Padding>
      );
    }
    return <div/>;
  },
  renderTarget(){
    const target = this.getCheck().get('target');
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
        <h3>Target</h3>
        {el}
      </Padding>
    );
  },
  renderInner(){
    if (this.getCheck().get('name')){
      const spec = this.getCheck().get('check_spec').value;
      return (
        <div>
          {this.renderTarget()}
          <Padding b={1}>
            <h3>HTTP Request</h3>
            <Alert bsStyle="default" style={{wordBreak: 'break-all'}}>
              <strong>{spec.verb}</strong> {spec.protocol}://{this.getLink()}:<span>{spec.port}</span>{spec.path}
            </Alert>
          </Padding>
          <Padding b={1}>
            <CheckResponsePaginate responses={this.getResponses()}/>
          </Padding>
          <Padding b={1}>
            <h3>Assertions</h3>
            <AssertionItemList assertions={this.getCheck().get('assertions')}/>
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
