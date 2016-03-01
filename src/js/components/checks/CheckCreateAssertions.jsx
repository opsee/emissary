import React, {PropTypes} from 'react';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import forms from 'newforms';
import _ from 'lodash';
import {BastionRequirement, Toolbar} from '../global';
import {History} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import assertionTypes from 'slate/src/types';
import relationships from 'slate/src/relationships';
import {BoundField} from '../forms';
import {Close, Add} from '../icons';
import {UserDataRequirement} from '../user';
import AssertionCounter from './AssertionCounter';
import CheckResponsePaginate from './CheckResponsePaginate';
import CheckDisabledReason from './CheckDisabledReason';
import {validateCheck} from '../../modules';
import {Padding} from '../layout';
import {Button} from '../forms';
import {user as userActions} from '../../actions';
import {Heading} from '../type';

const assertionTypeOptions = assertionTypes.map(assertion => [assertion.id, assertion.name]);
const relationshipOptions = relationships.map(relationship => [relationship.id, relationship.name]);

function relationshipConcernsEmpty(relationship){
  if (typeof relationship === 'string' && relationship.match('empty|notEmpty')){
    return true;
  }
  return false;
}

const AssertionsForm = forms.Form.extend({
  key: forms.ChoiceField({
    widgetAttrs: {
      noLabel: true,
      widgetType: 'Dropdown'
    },
    choices: assertionTypeOptions
  }),
  relationship: forms.ChoiceField({
    widgetAttrs: {
      noLabel: true,
      widgetType: 'Dropdown'
    },
    choices: relationshipOptions
  }),
  operand: forms.CharField({
    label: 'Value',
    widgetAttrs: {
      placeholder: 'Value'
    },
    required: false
  }),
  value: forms.CharField({
    label: 'Header Key',
    widgetAttrs: {
      placeholder: 'i.e. Content-Type'
    },
    required: false
  }),
  clean(){
    if (!relationshipConcernsEmpty(this.cleanedData.relationship)){
      if (!this.cleanedData.operand){
        throw forms.ValidationError('Assertion must have operand.');
      }
    }
    switch (this.cleanedData.key){
    case 'code':
      break;
    case 'header':
      if (!relationshipConcernsEmpty(this.cleanedData.relationship)){
        if (!this.cleanedData.value){
          throw forms.ValidationError('Header assertion must have a value.');
        }
      }
      break;
    default:
      break;
    }
  }
});

const AssertionsFormSet = forms.FormSet.extend({
  form: AssertionsForm,
  canDelete: true
});

const CheckCreateAssertions = React.createClass({
  mixins: [History],
  propTypes: {
    check: PropTypes.object,
    response: PropTypes.object,
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
  },
  getInitialState() {
    const self = this;
    const obj = {
      assertions: new AssertionsFormSet({
        onChange: self.runChange,
        labelSuffix: '',
        initial: _.cloneDeep(this.props.check.assertions),
        minNum: !this.props.check.assertions.length ? 1 : 0,
        extra: 0
      }),
      response: this.props.response,
      hasSetAssertions: !self.isDataComplete()
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(() => {
      self.state.assertions.forms().forEach((form, i) => {
        //checking here accounts for empty assertion forms
        let data = self.props.check.assertions[i];
        if (data){
          form.setData(data);
        }
      });
      if (self.isMounted()){
        self.setState({hasSetAssertions: true});
      }
    }, 50);
    return obj;
  },
  getAssertionsForms(){
    return _.reject(this.state.assertions.forms(), f => {
      return f.cleanedData.DELETE;
    });
  },
  getFinalData(){
    let check = _.cloneDeep(this.props.check);
    if (this.state.hasSetAssertions){
      check.assertions = this.getAssertionsForms().map(form => {
        return _.omit(form.cleanedData, 'DELETE');
      });
    }
    return check;
  },
  getResponse(){
    const data = this.props.redux.checks.responses;
    let val;
    if (data){
      let responses = data.toJS();
      if (responses && responses.length){
        val = _.get(responses[this.props.redux.checks.selectedResponse], 'response.value');
      }
    }
    return val;
  },
  isDataComplete(){
    return this.props.check.assertions.length;
  },
  isDisabled(){
    return validateCheck(this.props.check, ['assertions']).length;
  },
  runChange(){
    this.props.onChange(this.getFinalData(), this.isDisabled(), 2);
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckAssertionsHelp');
  },
  handleSubmit(e){
    e.preventDefault();
    this.history.pushState(null, '/check-create/info');
  },
  renderOperand(form){
    const data = form.cleanedData;
    if (data && data.relationship && !data.relationship.match('empty|notEmpty')){
      return (
        <Padding t={1}>
          <BoundField bf={form.boundField('operand')}/>
        </Padding>
      );
    }
    return null;
  },
  renderValue(form){
    const data = form.cleanedData;
    if (data && data.relationship && data.key === 'header'){
      return (
        <BoundField bf={form.boundField('value')}/>
      );
    }
    return null;
  },
  renderDeleteAssertionButton(form, index){
    if (index > 0){
      return (
        <Col xs={2} sm={1}>
          <BoundField bf={form.boundField('DELETE')}/>
        </Col>
      );
    }
    return null;
  },
  renderAssertionsForm(){
    return (
      <div>
        {this.getAssertionsForms().map((form, index) => {
          return (
            <Grid fluid key={`assertion-${index}`}>
              <Row>
                <Col xs={2} sm={1}>
                  <AssertionCounter label={index + 1} {...form.cleanedData} keyData={form.cleanedData.key} response={this.getResponse()}/>
                </Col>
                <Col xs={8} sm={10}>
                  <Row>
                    <Col xs={12}>
                      <Row>
                        <Col xs={12} sm={6} key={`assertion-key-${index}`}>
                          <Padding b={1}>
                            <BoundField bf={form.boundField('key')}/>
                          </Padding>
                        </Col>
                        <Col xs={12} sm={6} smOffset={0} key={`assertion-relationship-${index}`}>
                          <Padding b={1}>
                            <BoundField bf={form.boundField('relationship')}/>
                          </Padding>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      {this.renderValue(form, `assertion-${index}-value-field`)}
                      {this.renderOperand(form, `assertion-${index}-operand-field`)}
                    </Col>
                  </Row>
                </Col>
                {this.renderDeleteAssertionButton(form, index)}
              </Row>
              <hr/>
            </Grid>
          );
        })
        }
        <Padding t={1}>
          <Button color="primary" flat onClick={this.state.assertions.addAnother.bind(this.state.assertions)}>
            <Add inline fill="primary"/> Add Assertion
          </Button>
        </Padding>
      </div>
    );
  },
  renderHelperText(){
    return (
        <UserDataRequirement hideIf="hasDismissedCheckAssertionsHelp">
          <Alert bsStyle="success" onDismiss={this.runDismissHelperText}>
            <p>Now the fun part. Assertions are used to determine passing or failing state. A simple and effective assertion might be: <strong>'Status Code equal to 200'</strong>. When defining multiple assertions, <strong>all</strong> must pass for the check to be deemed <em>passing</em>.</p>
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
  renderInner() {
    return (
      <form ref="form" onSubmit={this.handleSubmit}>
        <Padding t={1}>
          <Heading level={3}>Assertions</Heading>
        </Padding>
        <p>Define the conditions required for this check to pass. Your response and request are shown for context. You must have at least one assertion.</p>
        <br />
        {this.renderAssertionsForm()}
        <div><br/></div>
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