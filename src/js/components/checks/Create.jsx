import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Check} from '../../modules/schemas';
import CheckDebug from './CheckDebug';
import config from '../../modules/config';
import {getCheckTypes, yeller} from '../../modules';
import {
  checks as actions,
  user as userActions,
  env as envActions,
  onboard as onboardActions
} from '../../actions';

const CheckCreate = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      testCheckReset: PropTypes.func,
      createOrEdit: PropTypes.func
    }),
    onboardActions: PropTypes.shape({
      getDefaultNotifications: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.object,
    children: PropTypes.node,
    redux: PropTypes.shape({
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object,
          elb: PropTypes.object,
          asg: PropTypes.object
        }),
        instances: PropTypes.shape({
          ecc: PropTypes.object,
          rds: PropTypes.object
        }),
        activeBastion: PropTypes.object
      }).isRequired,
      asyncActions: PropTypes.shape({
        checkCreate: PropTypes.object,
        getGroupsSecurity: PropTypes.object,
        getGroupsAsg: PropTypes.object
      }),
      user: PropTypes.object
    }).isRequired,
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }).isRequired,
    envActions: PropTypes.shape({
      getGroupsSecurity: PropTypes.func,
      getGroupsElb: PropTypes.func,
      getGroupsAsg: PropTypes.func,
      getInstancesEcc: PropTypes.func,
      getInstancesRds: PropTypes.func,
      getGroupsEcs: PropTypes.func
    }).isRequired
  },
  componentWillMount(){
    this.props.actions.testCheckReset();
    this.props.onboardActions.getDefaultNotifications();
    if (!this.props.redux.asyncActions.getGroupsSecurity.history.length && !!this.props.redux.env.activeBastion){
      this.props.envActions.getGroupsSecurity();
      this.props.envActions.getGroupsAsg();
      this.props.envActions.getGroupsEcs();
      this.props.envActions.getGroupsElb();
      this.props.envActions.getInstancesEcc();
      this.props.envActions.getInstancesRds();
    }
  },
  componentWillReceiveProps(nextProps) {
    const stat = 'redux.asyncActions.onboardGetDefaultNotifs.status';
    if (_.get(this.props, stat) !== _.get(nextProps, stat) && _.get(nextProps, stat) === 'success'){
      const nextNotifs = nextProps.redux.onboard.defaultNotifs;
      const check = _.assign(this.state.check, {
        notifications: nextNotifs
      });
      this.setState(check);
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
        yeller.report(new Error('Check JSON in url for create flow is not valid.'), {
          custom_data: {
            string: this.props.location.query.data
          }
        });
      }
    }
    let initial = _.chain(data).defaults({
      target: {
        name: config.checkDefaultTargetName,
        type: config.checkDefaultTargetType,
        id: config.checkDefaultTargetId
      }
    }).value();
    if (initial.target.type === 'ecs'){
      initial.target.service = _.chain(data).get('target.id').thru(a => (a || '').split('/')).last().value() || undefined;
    }
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
          onFilterChange: this.handleFilterChange,
          types: getCheckTypes(this.props.redux)
        }, this.state)
        )}
        <CheckDebug check={this.state.check}/>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  envActions: bindActionCreators(envActions, dispatch),
  onboardActions: bindActionCreators(onboardActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckCreate);