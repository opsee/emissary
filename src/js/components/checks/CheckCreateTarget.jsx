import React, {PropTypes} from 'react';
import _ from 'lodash';
import fuzzy from 'fuzzy';

import router from '../../modules/router';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';

import {Button} from '../forms';
import {Toolbar, StepCounter} from '../global';
import {Close} from '../icons';
import {UserDataRequirement} from '../user';
import {UserActions, GroupActions} from '../../actions';
import {CheckStore} from '../../stores';
import {EnvWithFilter} from '../env';
import {Padding} from '../layout';

const CheckCreateTarget = React.createClass({
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool,
    filter: PropTypes.string,
    onFilterChange: PropTypes.func
  },
  getInitialState() {
    const obj = {
      selected: this.props.check.target.id
    };
    return _.extend(obj, {
      cleanedData: null
    });
  },
  componentWillMount(){
    GroupActions.getGroupsSecurity();
    GroupActions.getGroupsELB();
  },
  componentDidMount(){
    if (this.props.renderAsInclude){
      this.runChange();
    }
  },
  isDisabled(){
    return false;
  },
  getFinalData(){
    let check = CheckStore.newCheck().toJS();
    check.target.id = this.state.selected;
    check.target.type = this.state.selectedType;
    return check;
  },
  getGroupsSecurity(){
    const string = this.state.filter.cleanedData.filter;
    if (string){
      const data = this.state.groupsSecurity.filter(sg => {
        return fuzzy.filter(string, [sg.get('name')]).length;
      });
      return data;
    }
    return this.state.groupsSecurity;
  },
  getGroupsELB(){
    const string = this.state.filter.cleanedData.filter;
    if (string){
      return this.state.groupsELB.filter(elb => {
        return fuzzy.filter(string, [elb.get('name')]).length;
      });
    }
    return this.state.groupsELB;
  },
  runChange(){
    let data = this.getFinalData();
    this.props.onChange(data, this.isDisabled(), 1);
  },
  runDismissHelperText(){
    UserActions.userPutUserData('hasDismissedCheckCreationHelp');
  },
  handleSubmit(e){
    e.preventDefault();
    router.transitionTo('checkCreateRequest');
  },
  handleTargetSelect(id, type){
    let check = CheckStore.newCheck().toJS();
    check.target.id = id;
    check.target.type = type || 'sg';
    this.setState({
      selected: check.target.id,
      selectedType: type
    });
    this.props.onChange(check, this.isDisabled(), 1);
    router.transitionTo('checkCreateRequest');
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <Padding t={2}>
            <Button color="success" block type="submit" onClick={this.handleSubmit} disabled={this.isDisabled()} title={this.isDisabled() ? 'Complete the form to move on.' : 'Define Assertions'} chevron>Next: Define Assertions</Button>
          </Padding>
          <StepCounter active={1} steps={3}/>
        </div>
      );
    }
    return <div/>;
  },
  renderHelperText(){
    return (
      <UserDataRequirement hideIf="hasDismissedCheckCreationHelp">
        <Alert type="info" onDismiss={this.runDismissHelperText}>
          <p>Let’s create your first health check! Tell us which group to check, and Opsee will apply it to the right instances.<br/>Only HTTP checks are supported right now.</p>
        </Alert>
        <div><br/></div>
      </UserDataRequirement>
    );
  },
  renderInner(){
    return (
      <div>
        <Padding b={2}>
          <h2>Choose a Target for your Health Check</h2>
          <p>What would you like to check? When targeting a group or ELB, your check will automatically run on all of its instances. Note: only groups and ELBs are currently supported as targets.</p>
        </Padding>
        {this.renderHelperText()}
        <EnvWithFilter onTargetSelect={this.handleTargetSelect} include={['groupsSecurity', 'groupsELB']} filter={this.props.filter} onFilterChange={this.props.onFilterChange}/>
        <StepCounter active={1} steps={4}/>
      </div>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (1 of 4)" bg="info">
          <Button icon flat to="checks">
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
                {this.renderInner()}
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

export default CheckCreateTarget;