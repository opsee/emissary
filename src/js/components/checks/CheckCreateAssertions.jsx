import React, {PropTypes} from 'react';
import {Alert, Col, Grid, Row} from '../layout';
import _ from 'lodash';
import {BastionRequirement, Toolbar} from '../global';
import {History} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Close} from '../icons';
import {UserDataRequirement} from '../user';
import CheckResponsePaginate from './CheckResponsePaginate';
import CheckDisabledReason from './CheckDisabledReason';
import {validate} from '../../modules';
import {Padding} from '../layout';
import {Button} from '../forms';
import {user as userActions} from '../../actions';
import {Heading} from '../type';
import AssertionSelection from './AssertionSelection';

const CheckCreateAssertions = React.createClass({
  mixins: [History],
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool,
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        responses: PropTypes.object,
        selectedResponse: PropTypes.number
      })
    })
  },
  componentWillMount(){
    if (!this.props.check.target.type && process.env.NODE_ENV !== 'debug'){
      this.history.pushState(null, '/check-create/target');
    }
    //setup default assertions if we can
    const check = _.cloneDeep(this.props.check);
    if (!check.assertions.length && this.getResponse().code){
      check.assertions = [
        {
          key: 'code',
          operand: this.getResponse().code,
          relationship: 'equal'
        }
      ];
      this.runChange(check);
    }
  },
  getInitialState() {
    return {
      hasSetAssertions: false
    };
  },
  getResponse(){
    const {checks} = this.props.redux;
    const data = checks.responses.toJS()[checks.selectedResponse];
    if (data && data.response){
      return _.get(data, 'response.value');
    }
    return {};
  },
  getFinalData(data){
    let check = data || _.cloneDeep(this.props.check);
    check.assertions = check.assertions.map(a => {
      return _.pick(a, ['key', 'value', 'relationship', 'operand']);
    });
    return check;
  },
  isDataComplete(){
    return this.props.check.assertions.length;
  },
  isDisabled(){
    return !!validate.check(this.props.check, ['assertions']).length;
  },
  runChange(data = undefined){
    this.props.onChange(this.getFinalData(data));
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckAssertionsHelp');
  },
  handleSubmit(e){
    e.preventDefault();
    const data = JSON.stringify(this.props.check);
    this.history.pushState(null, `/check-create/info?data=${data}`);
  },
  handleAssertionsChange(assertions = []){
    const data = _.assign({}, this.props.check, {assertions});
    this.props.onChange(data);
  },
  renderHelperText(){
    return (
        <UserDataRequirement hideIf="hasDismissedCheckAssertionsHelp">
          <Alert color="success" onDismiss={this.runDismissHelperText}>
            Now the fun part. Assertions are used to determine passing or failing state. A simple and effective assertion might be: <strong>'Status Code equal to 200'</strong>. When defining multiple assertions, <strong>all</strong> must pass for the check to be deemed <em>passing</em>.
          </Alert>
        </UserDataRequirement>
      );
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <Padding t={2}>
          <Button color="success" block type="submit" onClick={this.submit} disabled={this.isDisabled()} chevron>Next</Button>
          <CheckDisabledReason check={this.props.check} areas={['assertions']}/>
        </Padding>
      );
    }
    return null;
  },
  renderAssertionSelection(){
    const {props} = this;
    if ((props.renderAsInclude && props.check.COMPLETE) || !props.renderAsInclude){
      return (
        <Padding b={1}>
          <AssertionSelection assertions={this.props.check.assertions} onChange={this.handleAssertionsChange}/>
        </Padding>
      );
    }
    return null;
  },
  renderInner() {
    return (
      <form ref="form" onSubmit={this.handleSubmit}>
        <Padding t={1}>
          <Heading level={3}>Assertions</Heading>
        </Padding>
        <p>Define the conditions required for this check to pass. Your response and request are shown for context. You must have at least one assertion.</p>
        {this.renderAssertionSelection()}
        {this.renderSubmitButton()}
      </form>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (4 of 5)" bg="info">
          <Button to="/" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement>
                <Padding b={1}>
                  {this.renderHelperText()}
                </Padding>
                <Padding b={1}>
                  <CheckResponsePaginate check={this.props.check} showBoolArea={false}/>
                </Padding>
                <Padding tb={1}>
                  {this.renderInner()}
                </Padding>
              </BastionRequirement>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
  render() {
    return this.props.renderAsInclude ? this.renderInner() : this.renderAsPage();
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckCreateAssertions);