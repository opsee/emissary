import React, {PropTypes} from 'react';
import TimeAgo from 'react-timeago';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Table, Toolbar, StatusHandler} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {SetInterval} from '../../modules/mixins';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Add} from '../icons';
import {Padding} from '../layout';
import {env as actions} from '../../reduxactions';

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
  getInstanceIds(){
    if (this.getGroup().get('name')){
      return _.pluck(this.getGroup().get('instances').toJS(), 'id');
    }
  },
  renderDescription(){
    const desc = this.getGroup().get('Description');
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
  renderInner(){
    if (this.getGroup().get('name')){
      return (
        <div>
          <Padding b={2}>
            <Button color="primary" flat to={`/check-create/request?target=${this.getGroup().get('id')}&type=elb`} title="Create New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>
          <Padding b={1}>
            <h3>{this.getGroup().get('id')} Information</h3>
            <Table>
              <tr>
                <td><strong>Created</strong></td>
                <td><TimeAgo date={new Date(this.getGroup().get('CreatedTime'))}/></td>
              </tr>
              {this.renderDescription()}
            </Table>
          </Padding>
          <Padding b={1}>
            <h3>Checks</h3>
            <CheckItemList type="groupELB" target={this.props.params.id} redux={this.props.redux}/>
          </Padding>
          <Padding b={1}>
            <h3>Instances ({this.getGroup().get('instances').size})</h3>
            <InstanceItemList ids={this.getInstanceIds()} redux={this.props.redux}/>
          </Padding>

        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getGroupElb.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`ELB: ${this.getGroup().get('name') || this.getGroup().get('id') || this.props.params.id}`} />
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

export default connect(null, mapDispatchToProps)(GroupElb);