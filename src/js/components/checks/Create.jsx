import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {StatusHandler} from '../global';
import {Check} from '../../modules/schemas';
import {checks as actions, user as userActions, env as envActions} from '../../actions';

const CheckCreate = React.createClass({
  propTypes: {
    location: PropTypes.object,
    children: PropTypes.node,
    redux: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      create: PropTypes.func
    }),
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    envActions: PropTypes.shape({
      getGroupsSecurity: PropTypes.func,
      getGroupsElb: PropTypes.func,
      getInstancesEcc: PropTypes.func
    })
  },
  componentWillMount(){
    this.props.envActions.getGroupsSecurity();
    this.props.envActions.getGroupsElb();
    this.props.envActions.getInstancesEcc();
  },
  getInitialState(){
    return this.getState();
  },
  getState(noCheck){
    const obj = {
      check: new Check({
        target: this.props.location.query,
        assertions: [
          {
            key: 'code',
            operand: 200,
            relationship: 'equal'
          }
        ]
      }).toJS(),
      filter: null
    };
    return _.omit(obj, noCheck ? 'check' : null);
  },
  setStatus(obj){
    this.setState(_.extend(this.state.statuses, obj));
  },
  setData(data){
    this.setState({
      check: _.cloneDeep(data)
    });
  },
  handleFilterChange(data){
    this.setState({
      filter: data
    });
  },
  handleSubmit(){
    this.props.actions.create(this.state.check);
    this.props.userActions.putData('hasDismissedCheckCreationHelp');
  },
  render() {
    return (
      <div>
        {React.cloneElement(this.props.children, _.assign({
          onChange: this.setData,
          onSubmit: this.handleSubmit,
          onFilterChange: this.handleFilterChange
        }, this.state)
        )}
        <Grid>
          <Row>
            <Col xs={12}>
              <StatusHandler status={this.props.redux.asyncActions.checkCreate.status}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  envActions: bindActionCreators(envActions, dispatch)
});

export default connect(null, mapDispatchToProps)(CheckCreate);