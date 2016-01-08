import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler, Table, Toolbar} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {SetInterval} from '../../modules/mixins';
import {Button} from '../forms';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Add} from '../icons';
import {Padding} from '../layout';
import {env as actions} from '../../actions';

const GroupSecurity = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getGroupSecurity: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object
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
  // shouldComponentUpdate(nextProps) {
  //   return !Immutable.is(this.props.group, nextProps.group);
  // },
  getData(){
    this.props.actions.getGroupSecurity(this.props.params.id);
  },
  getGroup(){
    return this.props.redux.env.groups.security.find(g => {
      return g.get('id') === this.props.params.id;
    }) || new Map({id: this.props.params.id});
  },
  getInstanceIds(){
    if (this.getGroup().get('name')){
      return _.pluck(this.getGroup().get('instances').toJS(), 'id');
    }
  },
  renderDescription(){
    const desc = this.getGroup().get('Description');
    if (desc && desc !== ''){
      return <span>{desc}</span>;
    }
    return null;
  },
  renderInner(){
    if (this.getGroup().get('name')){
      return (
        <div>
          <Padding b={2}>
            <Button color="primary" flat to={`/check-create/request?id=${this.getGroup().get('id')}&type=security&name=${this.getGroup().get('name')}`} title="Create New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>
          <Padding b={1}>
            <h3>{this.getGroup().get('id')} Information</h3>
            <Table>
              <tr>
                <td><strong>Description</strong></td>
                <td>{this.renderDescription()}</td>
              </tr>
            </Table>
          </Padding>
          <Padding b={1}>
            <CheckItemList type="groupSecurity" target={this.props.params.id} redux={this.props.redux} title/>
          </Padding>
          <Padding b={1}>
            <InstanceItemList groupSecurity={this.props.params.id} type="ECC" title/>
          </Padding>
          <Padding b={1}>
            <InstanceItemList groupSecurity={this.props.params.id} type="RDS" title/>
          </Padding>
        </div>
      );
    }
    return <StatusHandler status={this.props.redux.asyncActions.getGroupSecurity.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`Group: ${this.getGroup().get('name') || this.getGroup().get('id') || this.props.params.id}`} />
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

export default connect(null, mapDispatchToProps)(GroupSecurity);