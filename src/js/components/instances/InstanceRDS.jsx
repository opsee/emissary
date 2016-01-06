import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';

import {StatusHandler, Table, Toolbar} from '../global';
import TimeAgo from 'react-timeago';
import {SetInterval} from '../../modules/mixins';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Button} from '../forms';
import {Add} from '../icons';
import {GroupItemList} from '../groups';
import {CheckItemList} from '../checks';
import {env as actions} from '../../actions';

const InstanceRds = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getInstanceRds: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        instances: PropTypes.shape({
          rds: PropTypes.object
        })
      })
    })
  },
  componentWillMount(){
    this.getData();
  },
  componentDidMount(){
    this.setInterval(this.getData, 30000);
  },
  getData(){
    this.props.actions.getInstanceRds(this.props.params.id);
  },
  getInstance(){
    return this.props.redux.env.instances.rds.find(i => {
      return i.get('id') === this.props.params.id;
    }) || new Map();
  },
  getGroupIds(){
    if (this.getInstance().get('name')){
      return _.pluck(this.getInstance().groups.toJS(), 'id');
    }
  },
  getGroupsSecurity(){
    if (this.getInstance().get('name')){
      return _.pluck(this.getInstance().toJS().VpcSecurityGroups, 'VpcSecurityGroupId');
    }
    return [];
  },
  renderLastChecked(){
    const d = this.getInstance().get('lastChecked');
    if (d){
      return (
        <tr>
          <td><strong>Last Checked</strong></td>
          <td title={`Last Checked: ${d.toISOString()}`}>
            <TimeAgo date={this.getInstance().get('lastChecked')}/>
          </td>
        </tr>
      );
    }
    return <tr/>;
  },
  renderCreateCheckButton(){
    if (window.ldclient.toggle('rds-checks')) {
      return (
        <Padding b={2}>
          <Button color="primary" flat to={`/check-create/request?id=${this.getInstance().get('id')}&type=RDS&name=${this.getInstance().get('name')}`} title="Create New Check">
            <Add fill="primary" inline/> Create a Check
          </Button>
        </Padding>
      );
    }
    return <div/>;
  },
  renderChecks(){
    if (window.ldclient.toggle('rds-checks')) {
      return (
        <Padding b={1}>
          <CheckItemList type="instance" target={this.props.params.id} title/>
        </Padding>
      );
    }
    return <div/>;
  },
  renderInner(){
    if (this.getInstance().get('name')){
      return (
        <div>
          {this.renderCreateCheckButton()}
          <Padding b={1}>
            <h3>{this.props.params.id} Information</h3>
            <Table>
              <tr>
                <td><strong>Launched</strong></td>
                <td>
                  <TimeAgo date={this.getInstance().get('LaunchTime')}/>
                </td>
              </tr>
              <tr>
                <td><strong>Public</strong></td>
                <td>{this.getInstance().get('PubliclyAccessible') ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td><strong>Engine</strong></td>
                <td>{this.getInstance().get('Engine')} {this.getInstance().get('EngineVersion')}</td>
              </tr>
              <tr>
                <td><strong>Instance Type</strong></td>
                <td>{this.getInstance().get('DBInstanceClass')}</td>
              </tr>
              <tr>
                <td><strong>Availability Zone</strong></td>
                <td>{this.getInstance().get('AvailabilityZone')}</td>
              </tr>
              {this.renderLastChecked()}
            </Table>
          </Padding>
          {this.renderChecks()}
          <Padding b={1}>
            <GroupItemList ids={this.getGroupsSecurity()} title="Security Groups"/>
          </Padding>
          <Padding tb={1}>
            <GroupItemList type="elb" instanceIds={[this.getInstance().get('id')]} title="ELBs" noFallback/>
          </Padding>
        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getInstanceRds.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`Instance: ${this.getInstance().get('name') || this.getInstance().get('id') || this.props.params.id}`}/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
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

export default connect(null, mapDispatchToProps)(InstanceRds);