import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import UserInputs from './UserInputs.jsx';
import {Close} from '../icons';
import {user as actions} from '../../actions';

const ProfileEdit = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      edit: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object
      }),
      user: PropTypes.object
    })
  },
  getInitialState() {
    return {
      user: this.props.redux.user.toJS()
    };
  },
  getStatus(){
    return this.props.redux.asyncActions.userEdit.status;
  },
  isDisabled(){
    return !(this.state.user.email && this.state.user.name) ||
    this.getStatus() === 'pending';
  },
  handleUserData(data){
    const user = _.assign({}, this.state.user, data);
    this.setState({user});
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.edit(this.state.user);
  },
  render() {
    return (
       <div>
        <Toolbar title="Edit Your Profile" bg="info" btnPosition="midRight">
          <Button to="/profile" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <form onSubmit={this.handleSubmit}>
                <UserInputs include={['email', 'name', 'password']} onChange={this.handleUserData} data={this.state.user}/>
                <StatusHandler status={this.getStatus()}/>
                <Padding t={2}>
                  <Button color="success" type="submit" block disabled={this.isDisabled()}>
                    {this.getStatus() === 'pending' ? 'Updating...' : 'Update'}
                  </Button>
                </Padding>
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

export default connect(null, mapDispatchToProps)(ProfileEdit);