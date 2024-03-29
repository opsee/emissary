import React, {PropTypes} from 'react';
import TimeAgo from 'react-timeago';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';
import _ from 'lodash';

import {Table, Toolbar, StatusHandler} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {SetInterval} from '../../modules/mixins';
import {Button} from '../forms';
import {Add} from '../icons';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import {env as actions} from '../../actions';

const GroupElb = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getGroupElb: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
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
    this.props.actions.getGroupElb(this.props.params.id);
  },
  getGroup(){
    return this.props.redux.env.groups.elb.find(g => {
      return g.get('id') === this.props.params.id;
    }) || new Map();
  },
  getCreateLink(){
    const data = window.encodeURIComponent(JSON.stringify({
      target: {
        id: this.getGroup().get('id'),
        type: 'elb',
        name: this.getGroup().get('name')
      }
    }));
    return `/check-create/request?data=${data}`;
  },
  renderDescription(group){
    const desc = group.Description;
    if (desc && desc !== ''){
      return (
        <tr>
          <td><strong>Description</strong></td>
          <td>{desc}</td>
        </tr>
      );
    }
    return <tr/>;
  },
  renderListeners(group){
    if (group.ListenerDescriptions.length){
      return (
        <tr>
          <td><strong>Listeners</strong></td>
          <td>
            {group.ListenerDescriptions.map((item, index) => {
              const l = item.Listener;
              return (
                <div style={{paddingTop: index !== 0 ? '1rem' : 0}}>
                  Instance Port: {l.InstancePort}<br/>
                  ELB Port: {l.LoadBalancerPort}<br/>
                  Protocol: {l.Protocol}
                </div>
              );
            })}
          </td>
        </tr>
      );
    }
    return null;
  },
  renderInner(group){
    if (group.name && group.CreatedTime){
      return (
        <div>
          <Padding b={2}>
            <Button color="primary" flat to={this.getCreateLink()} title="Create a New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>
          <Padding b={2}>
            <Heading level={3}>{group.id} Information</Heading>
            <Table>
              <tr>
                <td><strong>Created</strong></td>
                <td><TimeAgo date={group.CreatedTime}/></td>
              </tr>
              {this.renderListeners(group)}
              {this.renderDescription(group)}
            </Table>
          </Padding>
          <Padding b={2}>
            <CheckItemList type="groupELB" target={this.props.params.id} title/>
          </Padding>
          <Padding b={2}>
            <InstanceItemList ids={_.map(group.Instances, 'InstanceId')} redux={this.props.redux} title/>
          </Padding>
        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getGroupElb.status}/>;
  },
  render() {
    const group = this.getGroup().toJS();
    return (
      <div>
        <Toolbar title={`ELB: ${group.name || group.id || this.props.params.id}`} />
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                {this.renderInner(group)}
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

export default connect(null, mapDispatchToProps)(GroupElb);