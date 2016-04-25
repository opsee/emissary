import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Check} from '../../modules/schemas';
import CheckDebug from './CheckDebug';
import config from '../../modules/config';
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
      getInstancesEcc: PropTypes.func,
      getInstancesRds: PropTypes.func
    })
  },
  componentWillMount(){
    this.props.actions.testCheckReset();
    if (!this.props.redux.asyncActions.getGroupsSecurity.history.length){
      this.props.envActions.getGroupsSecurity();
      this.props.envActions.getGroupsElb();
      this.props.envActions.getInstancesEcc();
      this.props.envActions.getInstancesRds();
    }
  },
  getInitialState(){
    return this.getState();
  },
  getState(){
    let data = this.props.location.query.data;
    if (data && typeof data === 'string'){
      try {
        data = JSON.parse(data);
      } catch (err){
        data = {};
      }
    }
    const initial = _.chain(data).defaults({
      target: {
        name: config.checkDefaultTargetName,
        type: config.checkDefaultTargetType,
        id: config.checkDefaultTargetId
      },
      notifications: [
        {
          type: 'email',
          value: this.props.redux.user.get('email')
        }
      ]
    }).value();
    return {
      check: new Check(initial).toJS(),
      filter: null
    };
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
    this.props.actions.createOrEdit([this.state.check]);
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