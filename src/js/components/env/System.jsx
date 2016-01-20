import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import TimeAgo from 'react-timeago';

import {StatusHandler, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Heading} from '../type';
import config from '../../modules/config';
import {user as actions, env as envActions} from '../../actions';

const System = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getCustomer: PropTypes.func,
      getData: PropTypes.func
    }),
    envActions: PropTypes.shape({
      getBastions: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        bastions: PropTypes.array.isRequired
      }),
      asyncActions: PropTypes.shape({
        envGetBastions: PropTypes.object.isRequired
      }),
      user: PropTypes.object
    })
  },
  getInitialState(){
    return {
      bastions: undefined
    };
  },
  componentWillMount(){
    this.props.actions.getCustomer();
    this.props.actions.getData();
    this.props.envActions.getBastions();
  },
  renderBastionList(){
    const bastions = _.filter(this.props.redux.env.bastions, 'connected');
    if (bastions.length){
      return (
        <div>
          <Heading level={3}>Connected Bastions</Heading>
          <ul>
            {bastions.map((bastion, i) => {
              return (
                <li key={`bastion-${i}`}>
                  <strong>Created:</strong> <TimeAgo date={new Date(bastion.created_at)}/><br/>
                  <strong>ID:</strong> {bastion.id}<br/>
                  <strong>Group</strong>: {bastion.group_id.String}<br/>
                  <strong>Instance</strong>: {bastion.instance_id.String}<br/>
                  <strong>VPC</strong>: {bastion.vpc_id}<br/>
                  <strong>Subnet</strong>: {bastion.subnet_id}<br/>
                  <strong>Routing</strong>: {bastion.subnet_routing}
                </li>
                );
            })}
          </ul>
        </div>
      );
    }
    return <Heading level={3}>No Connected Bastions.</Heading>;
  },
  renderBastionsInfo(){
    const status = this.props.redux.asyncActions.envGetBastions.status;
    if (status === 'success'){
      return this.renderBastionList();
    }
    return <StatusHandler status={status}/>;
  },
  renderCustomerInfo(){
    if (this.props.redux.user.get('customer_id')){
      return (
        <Padding t={3}>
          <div><strong>Customer ID:</strong>&nbsp;<span className="text-secondary">{this.props.redux.user.get('customer_id')}</span></div>
        </Padding>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        <Toolbar title="System Status"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderBastionsInfo()}
              {this.renderCustomerInfo()}
              <strong>App Revision:</strong>&nbsp;<span className="text-secondary" style={{wordBreak: 'break-all'}}>{config.revision}</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  envActions: bindActionCreators(envActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(System);