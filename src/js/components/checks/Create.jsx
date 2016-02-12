import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Check} from '../../modules/schemas';
import CheckDebug from './CheckDebug';
import {
  checks as actions,
  user as userActions,
  env as envActions
} from '../../actions';

const CheckCreate = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      create: PropTypes.func,
      testCheckReset: PropTypes.func
    }),
    location: PropTypes.object,
    children: PropTypes.node,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        checkCreate: PropTypes.object,
        getGroupsSecurity: PropTypes.object
      }),
      user: PropTypes.object
    }).isRequired,
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
    this.props.actions.testCheckReset();
    if (!this.props.redux.asyncActions.getGroupsSecurity.history.length){
      this.props.envActions.getGroupsSecurity();
      this.props.envActions.getGroupsElb();
      this.props.envActions.getInstancesEcc();
    }
  },
  getInitialState(){
    return this.getState();
  },
  getState(){
    const obj = {
      check: new Check({
        target: this.props.location.query,
        assertions: [
          {
            key: 'code',
            operand: 200,
            relationship: 'equal'
          }
        ],
        notifications: [
          {
            type: 'email',
            value: this.props.redux.user.get('email')
          }
        ]
      }).toJS(),
      filter: null
    };
    return obj;
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
        <CheckDebug check={this.state.check}/>
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