import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {CheckActions, GlobalActions, UserActions} from '../../actions';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {StatusHandler} from '../global';
import {CheckStore} from '../../stores';
import {Check} from '../../modules/schemas';
import {checks as actions} from '../../reduxactions';

const CheckCreate = React.createClass({
  mixins: [CheckStore.mixin],
  propTypes: {
    location: PropTypes.object,
    children: PropTypes.node,
    redux: PropTypes.object.isRequired
  },
  getInitialState(){
    return this.getState();
  },
  storeDidChange() {
    const state = this.getState(true);
    if (state.createStatus === 'success'){
      UserActions.userPutUserData('hasDismissedCheckCreationHelp');
    }else if (state.createStatus && state.createStatus !== 'pending'){
      GlobalActions.globalModalMessage({
        html: status.body && status.body.message || 'Something went wrong.',
        style: 'danger'
      });
    }
    if (this.isMounted()){
      this.setState(state);
    }
  },
  getState(noCheck){
    const obj = {
      check: new Check({target: this.props.location.query}).toJS(),
      response: CheckStore.getResponse(),
      createStatus: CheckStore.getCheckCreateStatus(),
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
    CheckActions.checkCreate(this.state.check);
  },
  render() {
    return (
      <div>
        {React.cloneElement(this.props.children, _.assign({
          onChange: this.setData,
          onSubmit: this.handleSubmit,
          onFilterChange: this.handleFilterChange,
          redux: this.props.redux
        }, this.state)
        )}
        <Grid>
          <Row>
            <Col xs={12}>
              <StatusHandler status={this.state.createStatus}>
                <Alert bsStyle="danger">Something went wrong.</Alert>
              </StatusHandler>
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

export default connect(null, mapDispatchToProps)(CheckCreate);
