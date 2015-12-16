import React, {PropTypes} from 'react';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import forms from 'newforms';
import _ from 'lodash';
import {BastionRequirement, Toolbar, StepCounter} from '../global';
import {History} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import assertionTypes from 'slate/src/types';
import relationships from 'slate/src/relationships';
import {BoundField} from '../forms';
import {Close, Add} from '../icons';
import {UserDataRequirement} from '../user';
import AssertionCounter from './AssertionCounter.jsx';
import CheckResponsePaginate from './CheckResponsePaginate.jsx';
import {Padding} from '../layout';
import {Button} from '../forms';
import {user as userActions} from '../../actions';

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
    if (!this.props.check.target.type){
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
      self.setState({hasSetAssertions: true});
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
      check.assertions = _.reject(this.state.assertions.cleanedData(), 'DELETE').map(a => {
        return _.omit(a, 'DELETE');
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
    return !_.chain(this.getAssertionsForms()).map(a => a.isComplete()).every().value();
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
        <BoundField bf={form.boundField('operand')}/>
      );
    }
    return <div/>;
  },
  renderValue(form){
    const data = form.cleanedData;
    if (data && data.relationship && data.key === 'header'){
      return (
        <BoundField bf={form.boundField('value')}/>
      );
    }
    return <div/>;
  },
  renderDeleteAssertionButton(form, index){
    if (index > 0){
      return (
        <Col xs={2} sm={1}>
          <BoundField bf={form.boundField('DELETE')}/>
        </Col>
      );
    }
    return <span/>;
  },
  renderAssertionsForm(){
    return (
      <div>
        {this.getAssertionsForms().map((form, index) => {
          return (
            <Grid fluid key={`assertion-${index}`}>
              <Padding tb={2}>
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
              </Padding>
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
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <div><br/><br/></div>
          <div>
            <Button color="success" block type="submit" onClick={this.submit} disabled={this.isDisabled()} chevron>Next</Button>
          </div>
          <StepCounter active={3} steps={4}/>
        </div>
      );
    }
    return <div/>;
  },
  renderHelperText(){
    return (
        <UserDataRequirement hideIf="hasDismissedCheckAssertionsHelp">
          <Alert bsStyle="success" onDismiss={this.runDismissHelperText}>
            <p>Assertions are used to describe what a passing check looks like. A typical assertion for a HTTP check might be: <strong>'Status Code equal to 200'</strong>.</p>
          </Alert>
        </UserDataRequirement>
      );
  },
  renderInner() {
    return (
      <form ref="form" onSubmit={this.handleSubmit}>
        <Padding t={1}>
          <h3>Assertions</h3>
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
        <Toolbar btnPosition="midRight" title={`Create Check (3 of 4)`} bg="info">
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