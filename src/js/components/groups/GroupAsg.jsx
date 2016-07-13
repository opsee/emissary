import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import TimeAgo from 'react-timeago';

import {StatusHandler, Table, Toolbar} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {SetInterval} from '../../modules/mixins';
import {Button} from '../forms';
import {Add} from '../icons';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import {env as actions} from '../../actions';
import {flag} from '../../modules';

const GroupAsg = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getGroupAsg: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        groups: PropTypes.shape({
          asg: PropTypes.object
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
    this.props.actions.getGroupAsg(this.props.params.id);
  },
  getGroup(){
    return this.props.redux.env.groups.asg.find(g => {
      return g.get('id') === this.props.params.id;
    }) || new Map({id: this.props.params.id});
  },
  getCreateLink(){
    const data = window.encodeURIComponent(JSON.stringify({
      target: {
        id: this.getGroup().get('id'),
        type: 'asg',
        name: this.getGroup().get('name')
      }
    }));
    return `/check-create/request?data=${data}`;
  },
  renderCreateCheckButton(){
    if (flag('check-type-asg')){
      return (
        <Padding b={3}>
          <Button color="primary" flat to={this.getCreateLink()} title="Create a New Check">
            <Add fill="primary" inline/> Create a Check
          </Button>
        </Padding>
      );
    }
    return null;
  },
  renderInner(){
    const group = this.getGroup().toJS();
    if (group.name && group.CreatedTime){
      return (
        <div>
          {this.renderCreateCheckButton()}
          <Padding b={2}>
            <Heading level={3}>{group.id} Information</Heading>
            <Table>
              {group.Status && (
                <tr>
                  <td><strong>Status</strong></td>
                  <td>{group.Status}</td>
                </tr>
              )}
              <tr>
                <td><strong>Created</strong></td>
                <td><TimeAgo date={group.CreatedTime}/></td>
              </tr>
              <tr>
                <td><strong>Minimum Size</strong></td>
                <td>{group.MinSize}</td>
              </tr>
              <tr>
                <td><strong>Maximum Size</strong></td>
                <td>{group.MinSize}</td>
              </tr>
              <tr>
                <td><strong>Desired Capacity</strong></td>
                <td>{group.DesiredCapacity}</td>
              </tr>
              <tr>
                <td><strong>Availability Zones</strong></td>
                <td>{group.AvailabilityZones}</td>
              </tr>
              <tr>
                <td><strong>Suspended Processes</strong></td>
                <td>{group.SuspendedProcesses.length && group.SuspendedProcesses.map(process => {
                  return `${process.ProcessName} [${process.SuspensionReason}]`;
                }) || 'None'}</td>
              </tr>
            </Table>
          </Padding>
          <Padding b={2}>
            <CheckItemList type="groupAsg" target={this.props.params.id} redux={this.props.redux} title/>
          </Padding>
          <Padding b={2}>
            <InstanceItemList ids={_.map(group.Instances, 'InstanceId')} type="ecc" title/>
          </Padding>
        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getGroupAsg.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`Auto Scaling Group: ${this.getGroup().get('name') || this.getGroup().get('id') || this.props.params.id}`} />
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
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(GroupAsg);