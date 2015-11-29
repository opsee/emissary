import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler, Table, Toolbar} from '../global';
import TimeAgo from 'react-timeago';
import {SetInterval} from '../../modules/mixins';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Button} from '../forms';
import {Add} from '../icons';
import {GroupItemList} from '../groups';
import {CheckItemList} from '../checks';
import {env as actions} from '../../reduxactions';

const InstanceEcc = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getInstanceEcc: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        instances: PropTypes.shape({
          ecc: PropTypes.object
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
    }) || new Map();
  },
  getGroupIds(){
    if (this.getInstance().get('name')){
      return _.pluck(this.getInstance().groups.toJS(), 'id');
    }
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
  renderInner(){
    if (this.getInstance().get('name')){
      return (
        <div>
          <Padding b={2}>
            <Button color="primary" flat to={`/check-create/request?id=${this.getInstance().get('id')}&type=EC2&name=${this.getInstance().get('name')}`} title="Create New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>

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
                <td><strong>Instance Type</strong></td>
                <td>{this.getInstance().get('InstanceType')}</td>
              </tr>
              {this.renderAvailabilityZone()}
              {this.renderLastChecked()}
            </Table>
          </Padding>
          <Padding b={1}>
            <h3>Checks</h3>
            <CheckItemList type="instance" target={this.props.params.id}/>
          </Padding>
          <Padding b={1}>
            <GroupItemList ids={this.getGroupIds()} title="Security Groups"/>
          </Padding>
          <Padding b={1}>
            <GroupItemList type="elb" instanceIds={[this.getInstance().get('id')]} title="ELBs" noFallback/>
          </Padding>
          {
            // <h2>{this.data().checks.length} Checks</h2>
            // <ul className="list-unstyled">
            //   {this.getInstance().get('checks').map(i => {
            //     return (
            //       <li key={i.get('id')}>
            //         <CheckItem item={i}/>
            //       </li>
            //       )
            //   })}
            // </ul>
          }
        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getInstanceEcc.status}/>;
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

export default connect(null, mapDispatchToProps)(InstanceEcc);