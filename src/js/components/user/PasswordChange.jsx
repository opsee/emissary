import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {Col, Grid, Row} from '../layout';
import {Button} from '../forms';
import {user as actions} from '../../actions';

const PasswordChange = React.createClass({
  propTypes: {
    location: PropTypes.object,
    history: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      edit: PropTypes.func.isRequired,
      userApply: PropTypes.func.isRequired,
      refresh: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object
      })
    })
  },
  getInitialState(){
    return {
      password: null
    };
  },
  componentWillMount(){
    const id = parseInt(_.get(this.props.location, 'query.id'), 10);
    const token = _.get(this.props.location, 'query.token');
    if (!id || !token){
      return this.props.history.replace('/password-forgot');
    }
    const loginDate = new Date();
    const user = { id, loginDate };
    this.props.actions.userApply({ user, token });
    return this.props.actions.refresh();
  },
  getStatus(){
    return this.props.redux.asyncActions.userEdit.status;
  },
  getButtonText(){
    return this.getStatus() === 'pending' ? 'Changing...' : 'Change';
  },
  isDisabled(){
    return !this.state.password || this.getStatus() === 'pending';
  },
  setUserData(data){
    this.setState(data);
  },
  handleSubmit(e){
    e.preventDefault();
    const data = _.assign(this.state, this.props.location.query);
    this.props.actions.edit(data, '/profile');
  },
  render() {
    return (
       <div>
        <Toolbar title="Change Your Password"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <form onSubmit={this.handleSubmit}>
                <p>Enter your new password here.</p>
                <UserInputs include={['password']} onChange={this.setUserData} data={this.state}/>
                <StatusHandler status={this.getStatus()}/>
                <Button type="submit" color="success" block disabled={this.isDisabled()}>
                  {this.getButtonText()}
                </Button>
              </form>
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

export default connect(null, mapDispatchToProps)(PasswordChange);