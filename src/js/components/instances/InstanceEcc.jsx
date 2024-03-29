import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TimeAgo from 'react-timeago';

import {StatusHandler, Table, Toolbar} from '../global';
import {SetInterval} from '../../modules/mixins';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import {Button} from '../forms';
import {Add, Settings} from '../icons';
import {GroupItemList} from '../groups';
import {CheckItemList} from '../checks';
import {env as actions, app as appActions} from '../../actions';
import {InstanceEcc as Schema} from '../../modules/schemas';
import InstanceMenu from './InstanceMenu';

const InstanceEcc = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getInstanceEcc: PropTypes.func
    }),
    appActions: PropTypes.shape({
      openContextMenu: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        instances: PropTypes.shape({
          ecc: PropTypes.object
        }),
        groups: PropTypes.shape({
          elb: PropTypes.object
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
    this.props.actions.getInstanceEcc(this.props.params.id);
  },
  getInstance(){
    return this.props.redux.env.instances.ecc.find(i => {
      return i.get('id') === this.props.params.id;
    }) || new Schema();
  },
  getGroupsSecurity(){
    if (this.getInstance().get('name')){
      return _.map(this.getInstance().toJS().SecurityGroups, 'GroupId');
    }
    return [];
  },
  getGroupsELB(){
    if (this.getInstance().get('name')){
      return _.chain(this.props.redux.env.groups.elb.toJS()).filter(elb => {
        return _.chain(elb.instances).indexOf(this.getInstance().get('id')).value() > -1;
      }).map('id').value();
    }
    return [];
  },
  getTargets(){
    const initial = [this.props.params.id];
    return initial.concat(this.getGroupsSecurity()).concat(this.getGroupsELB());
  },
  getCreateLink(){
    const data = window.encodeURIComponent(JSON.stringify({
      target: {
        id: this.getInstance().get('id'),
        type: 'ecc',
        name: this.getInstance().get('name')
      }
    }));
    return `/check-create/request?data=${data}`;
  },
  handleActionsClick(){
    this.props.appActions.openContextMenu(this.getInstance().get('id'));
  },
  renderAvailabilityZone(){
    const az = _.get(this.getInstance().get('Placement'), 'AvailabilityZone');
    if (az){
      return (
        <tr>
          <td><strong>Availability Zone</strong></td>
          <td>{az}</td>
        </tr>
      );
    }
    return <tr/>;
  },
  renderInner(){
    const instance = this.getInstance().toJS();
    if (instance.name && instance.LaunchTime){
      return (
        <div>
          <Padding b={3}>
            <Button color="primary" flat to={this.getCreateLink()} title="Create New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>

          <Padding b={2}>
            <Heading level={3}>{this.props.params.id} Information</Heading>
            <Table>
              <tr>
                <td><strong>Private IP Address</strong></td>
                <td>{instance.PrivateIpAddress}</td>
              </tr>
              <tr>
                <td><strong>Launched</strong></td>
                <td>
                  <TimeAgo date={instance.LaunchTime}/>
                </td>
              </tr>
              <tr>
                <td><strong>Instance Type</strong></td>
                <td>{instance.InstanceType}</td>
              </tr>
              {this.renderAvailabilityZone()}
            </Table>
          </Padding>
          <Padding b={2}>
            <CheckItemList type="instance" target={this.getTargets()} title/>
          </Padding>
          <Padding b={2}>
            <GroupItemList ids={this.getGroupsSecurity()} title="Security Groups"/>
          </Padding>
          <Padding b={2}>
            <GroupItemList type="elb" instanceIds={[instance.id]} title="ELBs" noFallback/>
          </Padding>
        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getInstanceEcc.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`Instance: ${this.getInstance().get('name') || this.getInstance().get('id') || this.props.params.id}`}>
          <Button onClick={this.handleActionsClick} color="info" fab title={`${this.getInstance().get('name')} Actions`}>
            <Settings btn/>
          </Button>
        </Toolbar>
        <InstanceMenu item={this.getInstance()}/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                {this.renderInner()}
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(InstanceEcc);