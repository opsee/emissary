import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import LogoColor from '../global/LogoColor';
import {Heading} from '../type';
import {Checkmark} from '../icons';
import UserInputs from '../user/UserInputs.jsx';
import {Button} from '../forms';
import {Col, Grid, Padding, Row} from '../layout';
import {user as actions} from '../../actions';
import style from './onboard.css';

const OnboardWelcome = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      user: PropTypes.object.isRequired,
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object
      })
    }),
    actions: PropTypes.shape({
      edit: PropTypes.func
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentWillReceiveProps(nextProps) {
    const isPending = this.getStatus() === 'pending';
    const willBeDone = nextProps.redux.asyncActions.userEdit.status === 'success';
    if (isPending && willBeDone) {
      setTimeout(() => {
        this.context.router.push('/');
      }, 500);
    }
  },
  getInitialState() {
    return {
      userData: {
        email: this.props.redux.user.get('email'),
        name: null,
        password: null
      }
    };
  },
  getStatus(){
    return this.props.redux.asyncActions.userEdit.status;
  },
  isDisabled(){
    const {email, name, password} = this.state.userData;
    const status = this.getStatus();
    return !email || !name || !password || status === 'pending';
  },
  handleUserData(userData) {
    this.setState({ userData });
  },
  handleSubmit(e){
    e.preventDefault();
    if (!this.isDisabled()) {
      const data = _.chain(this.state.userData)
        .pick(['email', 'password', 'name'])
        .assign({ id: this.props.redux.user.get('id' )})
        .value();
      this.props.actions.edit(data);
    }
  },
  renderSubmitButton(){
    let text;
    let chevron = true;
    let color = 'primary';
    const status = this.getStatus();

    if (status === 'pending') {
      text = 'Saving...';
    } else if (status === 'success') {
      chevron = false;
      color = 'success';
      text = <Checkmark btn />;
    } else {
      text = 'Save';
    }
    const disabled = this.isDisabled();
    return (
      <Button type="submit" block color={color} chevron={chevron} disabled={disabled}>{text}</Button>
    );
  },
  render() {
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding t={4} b={2} className="text-center">
                <LogoColor />
                <Heading l={2}>Welcome to Opsee!</Heading>
              </Padding>
              <p>Good news &mdash; you just created your first health check! Let's take a minute to finish setting up your account.</p>
              <form onSubmit={this.handleSubmit}>
                <UserInputs include={['email', 'name', 'password']} onChange={this.handleUserData} data={this.state.userData}/>
                <Padding tb={1}>
                  {this.renderSubmitButton()}
                </Padding>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardWelcome);