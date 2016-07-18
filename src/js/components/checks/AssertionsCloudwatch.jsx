import React, {PropTypes} from 'react';
import {Alert, Col, Grid, Row} from '../layout';
import _ from 'lodash';
import {BastionRequirement, Toolbar} from '../global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Close} from '../icons';
import {UserDataRequirement} from '../user';
import CheckDisabledReason from './CheckDisabledReason';
import {validate} from '../../modules';
import {Padding, Rule} from '../layout';
import {Button} from '../forms';
import {
  user as userActions,
  app as appActions
} from '../../actions';
import {Heading} from '../type';
import AssertionSelectionCloudwatch from './AssertionSelectionCloudwatch';
import CheckTypeSwitcher from './CheckTypeSwitcher';

const AssertionsCloudwatch = React.createClass({
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    types: PropTypes.array.isRequired,
    renderAsInclude: PropTypes.bool,
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    appActions: PropTypes.shape({
      confirmOpen: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        responses: PropTypes.object,
        selectedResponse: PropTypes.number
      })
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentWillMount(){
    if (!this.props.check.target.type && process.env.NODE_ENV !== 'debug'){
      this.context.router.push('/check-create/target');
    }
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
    this.props.userActions.putData('hasDismissedCheckAssertionsCloudwatchHelp');
  },
  handleSubmit(e){
    e.preventDefault();
    const data = window.encodeURIComponent(JSON.stringify(this.props.check));
    this.context.router.push(`/check-create/info?data=${data}`);
  },
  handleAssertionsChange(assertions = []){
    const data = _.assign({}, this.props.check, {assertions});
    this.props.onChange(data);
  },
  renderHelperText(){
    return (
      <UserDataRequirement hideIf="hasDismissedCheckAssertionsCloudwatchHelp">
        <Alert color="success" onDismiss={this.runDismissHelperText}>
          Now the fun part. Assertions are used to determine passing or failing state. A simple and effective assertion might be: <strong>'CPU Utilization less than 90%'</strong>. When defining multiple assertions, <strong>all</strong> must pass for the check to be deemed <em>passing</em>.
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
    if ((props.renderAsInclude && _.find(props.check.tags, () => 'complete')) || !props.renderAsInclude){
      return (
        <Padding b={1}>
          <AssertionSelectionCloudwatch onChange={this.handleAssertionsChange} check={this.props.check}/>
        </Padding>
      );
    }
    return null;
  },
  renderInner() {
    return (
      <form ref="form" onSubmit={this.handleSubmit} noValidate>
        <Heading level={3}>Assertions</Heading>
        Select the CloudWatch metrics that you&rsquo;d like to keep an eye on. You must select at least one CloudWatch metric to assert on.
        <Rule/>
        <Padding t={1}>
          {this.renderAssertionSelection()}
        </Padding>
        {this.renderSubmitButton()}
      </form>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create a Check" bg="info">
          <Button to="/" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement>
                <Padding t={1}>
                  {!this.props.renderAsInclude && <CheckTypeSwitcher check={this.props.check} history={this.props.history} types={this.props.types} onChange={this.runChange}/>}
                  <Padding b={1}>
                    {this.renderHelperText()}
                  </Padding>
                  <Padding tb={1}>
                    {this.renderInner()}
                  </Padding>
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
  userActions: bindActionCreators(userActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AssertionsCloudwatch);