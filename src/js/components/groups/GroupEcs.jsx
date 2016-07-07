import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Table, Toolbar} from '../global';
import {CheckItemList} from '../checks';
import GroupItemList from './GroupItemList';
import {SetInterval} from '../../modules/mixins';
import {Button} from '../forms';
import {Add} from '../icons';
import {Col, Grid, Padding, Row, Rule} from '../layout';
import {Color, Heading} from '../type';
import {env as actions} from '../../actions';
import {flag} from '../../modules';

const GroupEcs = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getGroupEcs: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        groups: PropTypes.shape({
          ecs: PropTypes.object
        })
      })
    })
  },
  getInitialState() {
    return {
      showEvents: false
    };
  },
  componentWillMount(){
    this.getData();
  },
  componentDidMount(){
    this.setInterval(this.getData, 30000);
  },
  getData(){
    this.props.actions.getGroupEcs(this.props.params.id);
  },
  getGroup(){
    return this.props.redux.env.groups.ecs.find(g => {
      return unescape(g.get('id')) === this.props.params.id;
    }) || new Map({id: this.props.params.id});
  },
  getCreateLink(){
    const data = JSON.stringify({
      target: {
        id: this.getGroup().get('id'),
        type: 'ecs',
        name: this.getGroup().get('name')
      }
    });
    return `/check-create/request?data=${data}`;
  },
  handleEventsClick(e){
    e.preventDefault();
    this.setState({
      showEvents: !this.state.showEvents
    });
  },
  renderCreateCheckButton(){
    if (flag('check-type-ecs')){
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
  renderEvents(group){
    const num = this.state.showEvents ? group.Events.length : 2;
    const arr = _.take(group.Events, num);
    return (
      <div>
        {arr.map(event => {
          return (
            <div key={event.Id}>
              <Color c="gray6">{new Date(event.CreatedAt).toString()}</Color><br/>{event.Message}
              <Rule/>
            </div>
          );
        })}
      </div>
    );
  },
  renderInner(){
    const group = this.getGroup().toJS();
    const cluster = _.last((group.ClusterArn || '').split('/')) || '';
    const taskDef = _.last((group.TaskDefinition || '').split('/')) || '';
    if (group.name && group.Status){
      return (
        <div>
          {this.renderCreateCheckButton()}
          <Padding b={2}>
            <Heading level={3}>{group.ServiceName} Information</Heading>
            {
              // JSON.stringify(group)
            }
            <Table>
              <tr>
                <td><strong>Cluster</strong></td>
                <td>{cluster}</td>
              </tr>
              <tr>
                <td><strong>Task Definition</strong></td>
                <td>{taskDef}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td>{group.Status}</td>
              </tr>
              <tr>
                <td><strong>Desired Count</strong></td>
                <td>{group.DesiredCount}</td>
              </tr>
              <tr>
                <td><strong>Pending Count</strong></td>
                <td>{group.PendingCount}</td>
              </tr>
              <tr>
                <td><strong>Running Count</strong></td>
                <td>{group.RunningCount}</td>
              </tr>
            </Table>
          </Padding>
          <Padding b={2}>
            <Heading level={3}>Events</Heading>
            {this.renderEvents(group)}
            <a href="#" onClick={this.handleEventsClick}>{this.state.showEvents ? 'Hide Events' : `Show ${group.Events.length - 2} More Events`}</a>
          </Padding>
          <Padding b={2}>
            <CheckItemList type="groupEcs" target={this.props.params.id} redux={this.props.redux} title/>
          </Padding>
          <Padding b={2}>
            <GroupItemList ids={_.map(group.LoadBalancers, 'LoadBalancerName')} type="elb" title/>
          </Padding>
        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getGroupEcs.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`EC2 Container Service: ${this.getGroup().get('name') || this.getGroup().get('id') || this.props.params.id}`} />
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

export default connect(null, mapDispatchToProps)(GroupEcs);