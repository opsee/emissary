import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler, Table, Toolbar} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {SetInterval} from '../../modules/mixins';
import {Button} from '../forms';
import {Add} from '../icons';
import {Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {env as actions} from '../../actions';

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
    const data = JSON.stringify({
      target: {
        id: this.getGroup().get('id'),
        type: 'asg',
        name: this.getGroup().get('name')
      }
    });
    return `/check-create/request?data=${data}`;
  },
  renderInner(){
    const group = this.getGroup().toJS();
    if (group.name){
      return (
        <div>
          <Padding b={3}>
            <Button color="primary" flat to={this.getCreateLink()} title="Create a New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>
          <Padding b={2}>
            <Heading level={3}>{group.id} Information</Heading>
            <Table>
              {
              //   <tr>
              //   <td><strong>Description</strong></td>
              //   <td>{this.renderDescription()}</td>
                // </tr>
              }
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

export default connect(null, mapDispatchToProps)(GroupAsg);