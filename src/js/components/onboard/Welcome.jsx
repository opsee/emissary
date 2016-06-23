import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import LogoColor from '../global/LogoColor';
import {Heading} from '../type';
import {Checkmark} from '../icons';
import UserInputs from '../user/UserInputs.jsx';
import {Button} from '../forms';
import {Grid, Col, Row, Padding, Alert} from '../layout';
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
  renderError() {
    const { status } = this.props.redux.asyncActions.userEdit;
    if (status && typeof status !== 'string') {
      return (
        <Padding tb={1}>
          <Alert color="danger">
            Something went wrong when updating your account and we&rsquo;re looking into it.
            Please try again, or <Link to="/help">get in touch</Link>.
          </Alert>
        </Padding>
      );
    }
    return null;
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
      text = 'Start using Opsee';
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
              <p>Thanks for signing up! We just need a little more info to set up your account, then you&rsquo;ll be ready to go.</p>
              <form onSubmit={this.handleSubmit}>
                <UserInputs include={['email', 'name', 'password']}  autoFocus="name" onChange={this.handleUserData} data={this.state.userData}/>
                <Padding tb={1}>
                  {this.renderSubmitButton()}
                </Padding>
              </form>
              {this.renderError()}
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