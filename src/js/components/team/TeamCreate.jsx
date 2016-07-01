import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button, Input} from '../forms';
import {Close} from '../icons';
import {team as actions} from '../../actions';

const TeamCreate = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      edit: PropTypes.func.isRequired,
      getTeam: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object.isRequired,
        teamEdit: PropTypes.object.isRequired
      }).isRequired,
      team: PropTypes.object
    })
  },
  getInitialState() {
    return _.assign({}, this.props.redux.team.toJS(), {
      ccToken: undefined
    });
  },
  getData(props = this.props){
    return props.redux.team.toJS();
  },
  getStatus(){
    return this.props.redux.asyncActions.teamEdit.status;
  },
  isDisabled(){
    return !(this.state.name) ||
    this.getStatus() === 'pending';
  },
  handleUserData(data){
    const user = _.assign({}, this.state.user, data);
    this.setState({user});
  },
  handleInputChange(state){
    this.setState(state);
  },
  handleCreditCardChange(ccToken){
    this.setState({
      ccToken
    });
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.edit(this.state, '/team/member/invite');
  },
  renderCreditCard(){
    return null;
  },
  render() {
    return (
       <div>
        <Toolbar title="Create Your Team" bg="info" btnPosition="midRight">
          <Button to="/profile" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <form onSubmit={this.handleSubmit}>
                <StatusHandler status={this.getStatus()}/>
                <Input onChange={this.handleInputChange} data={this.state} path="name" placeholder="Team Name" label="Team Name*"/>
                {this.renderCreditCard()}
                <Padding t={2}>
                  <Button color="success" type="submit" block disabled={this.isDisabled()}>
                    {this.getStatus() === 'pending' ? 'Creating...' : 'Create'}
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

export default connect(null, mapDispatchToProps)(TeamCreate);