import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';
import TimeAgo from 'react-timeago';

import {StatusHandler, Table, Toolbar} from '../global';
import {SetInterval} from '../../modules/mixins';
import {Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {Button} from '../forms';
import {Add} from '../icons';
import {GroupItemList} from '../groups';
import {CheckItemList} from '../checks';
import {flag} from '../../modules';
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
  getCreateLink(){
    const data = JSON.stringify({
      target: {
        id: this.getInstance().get('id'),
        type: 'rds',
        name: this.getInstance().get('name')
      }
    });
    return `/check-create/assertions-cloudwatch?data=${data}`;
  },
  getGroupIds(){
    if (this.getInstance().get('name')){
      return _.map(this.getInstance().groups.toJS(), 'id');
    }
    return [];
  },
  getGroupsSecurity(){
    if (this.getInstance().get('name')){
      return _.map(this.getInstance().toJS().VpcSecurityGroups, 'VpcSecurityGroupId');
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
    if (flag('check-type-rds')) {
      return (
        <Padding b={3}>
          <Button color="primary" flat to={this.getCreateLink()} title="Create New Check">
            <Add fill="primary" inline/> Create a Check
          </Button>
        </Padding>
      );
    }
    return null;
  },
  renderChecks(){
    if (flag('check-type-rds')) {
      return (
        <Padding b={1}>
          <CheckItemList type="rds" target={this.props.params.id} title/>
        </Padding>
      );
    }
    return null;
  },
  renderInner(){
    const instance = this.getInstance().toJS();
    if (instance.name && instance.DBInstanceClass){
      return (
        <div>
          {this.renderCreateCheckButton()}
          <Padding b={2}>
            <Heading level={3}>{this.props.params.id} Information</Heading>
            <Table>
              <tr>
                <td><strong>Launched</strong></td>
                <td>
                  <TimeAgo date={instance.InstanceCreateTime}/>
                </td>
              </tr>
              <tr>
                <td><strong>Public</strong></td>
                <td>{instance.PubliclyAccessible ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td><strong>Engine</strong></td>
                <td>{instance.Engine} {instance.EngineVersion}</td>
              </tr>
              <tr>
                <td><strong>Instance Type</strong></td>
                <td>{instance.DBInstanceClass}</td>
              </tr>
              <tr>
                <td><strong>Availability Zone</strong></td>
                <td>{instance.AvailabilityZone}</td>
              </tr>
              {this.renderLastChecked()}
            </Table>
          </Padding>
          {this.renderChecks()}
          <Padding b={2}>
            <GroupItemList ids={this.getGroupsSecurity()} title="Security Groups"/>
          </Padding>
          <Padding b={2}>
            <GroupItemList type="elb" instanceIds={[instance.id]} title="ELBs" noFallback/>
          </Padding>
        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getInstanceRds.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`RDS DB Instance: ${this.getInstance().get('name') || this.getInstance().get('id') || this.props.params.id}`}/>
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