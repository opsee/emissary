import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import TimeAgo from 'react-timeago';

import {StatusHandler, Toolbar} from '../global';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Color, Heading} from '../type';
import {user as actions, env as envActions} from '../../actions';
import {Input} from '../forms';

const System = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
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
    this.props.actions.getData();
    this.props.envActions.getBastions();
  },
  renderState(b){
    let el = <Color c="success">Connected</Color>;
    if (!b.connected){
      el = <Color c="danger">Disconnected</Color>;
    }
    return (
      <div><strong>State:</strong>&nbsp; {el}</div>
    );
  },
  renderBastionList(){
    const bastions = _.chain(this.props.redux.env.bastions).sortBy(['created_at']).reverse().value();
    if (bastions.length){
      return (
        <div>
          <Heading level={3}>Bastions</Heading>
          <Padding l={2}>
            {bastions.map((bastion, i) => {
              return (
                <div key={`bastion-${i}`}>
                  {this.renderState(bastion)}
                  <div><strong>Created:</strong> <TimeAgo date={new Date(bastion.created_at)}/></div>
                  <div><strong>ID:</strong> {bastion.id}</div>
                  <div><strong>Region</strong>: {bastion.region}</div>
                  <div><strong>Group</strong>: {bastion.group_id.String}</div>
                  <div><strong>Instance</strong>: {bastion.instance_id.String}</div>
                  <div><strong>VPC</strong>: {bastion.vpc_id}</div>
                  <div><strong>Subnet</strong>: {bastion.subnet_id}</div>
                  <div><strong>Routing</strong>: {bastion.subnet_routing}</div>
                  <hr/>
                </div>
                );
            })}
          </Padding>
        </div>
      );
    }
    return <Heading level={3}>No Bastions.</Heading>;
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
          <div>
            <Padding b={1}>
              <strong>Customer ID:</strong><br/><span className="text-secondary">{this.props.redux.user.get('customer_id')}</span>
            </Padding>
            <Padding b={1}>
              <strong>API Token:</strong><br/>
              <Input textarea data={this.props.redux.user.toJS()} path="token" readOnly/>
            </Padding>
          </div>
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
              <Panel>
                <Padding b={1}>
                  <strong>App Revision:</strong><br/><span className="text-secondary" style={{wordBreak: 'break-all'}}>{process.env.REVISION}</span>
                </Padding>
                {this.renderCustomerInfo()}
                <Padding t={2}>
                  {this.renderBastionsInfo()}
                </Padding>
              </Panel>
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