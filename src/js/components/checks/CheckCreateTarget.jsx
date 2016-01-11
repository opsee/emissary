import React, {PropTypes} from 'react';
import _ from 'lodash';
import fuzzy from 'fuzzy';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {History} from 'react-router';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';

import {Button} from '../forms';
import {BastionRequirement, Toolbar} from '../global';
import {Close} from '../icons';
import {UserDataRequirement} from '../user';
import {EnvList} from '../env';
import {Padding} from '../layout';
import {Check} from '../../modules/schemas';
import {checks as actions, user as userActions} from '../../actions';

const CheckCreateTarget = React.createClass({
  mixins: [History],
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool,
    filter: PropTypes.string,
    onFilterChange: PropTypes.func,
    userActions: PropTypes.shape({
      putData: PropTypes.func
    })
  },
  getInitialState() {
    const obj = {
      selected: this.props.check.target.id
    };
    return _.extend(obj, {
      cleanedData: null
    });
  },
  componentDidMount(){
    if (this.props.renderAsInclude){
      this.runChange();
    }
  },
  getFinalData(){
    let check = this.props.check ? _.cloneDeep(this.props.check) : new Check().toJS();
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
  isDisabled(){
    return false;
  },
  runChange(){
    let data = this.getFinalData();
    this.props.onChange(data, this.isDisabled(), 1);
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckCreationHelp');
  },
  handleSubmit(e){
    e.preventDefault();
    this.history.pushState(null, '/check-create/request');
  },
  handleTargetSelect(item){
    let check = this.props.check ? _.cloneDeep(this.props.check) : new Check().toJS();
    check.target.id = item.get('id');
    check.target.type = item.get('type') || 'sg';
    check.target.name = item.get('name');
    this.setState({
      selected: check.target.id,
      selectedType: item.get('type') || 'sg'
    });
    this.props.onChange(check, this.isDisabled(), 1);
    this.history.pushState(null, '/check-create/request', {id: check.target.id, type: check.target.type, name: check.target.name});
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <Padding t={2}>
            <Button color="success" block type="submit" onClick={this.handleSubmit} disabled={this.isDisabled()} title={this.isDisabled() ? 'Complete the form to move on.' : 'Define Assertions'} chevron>Next: Define Assertions</Button>
          </Padding>
        </div>
      );
    }
    return null;
  },
  renderHelperText(){
    return (
      <UserDataRequirement hideIf="hasDismissedCheckCreationHelp">
        <Padding b={2}>
          <Alert bsStyle="success" onDismiss={this.runDismissHelperText}>
            <p>Let’s create a check! The first step is to choose a target to check. If you choose a Group or ELB, Opsee will automatically check all of its instances, even if it changes.</p>
          </Alert>
        </Padding>
      </UserDataRequirement>
    );
  },
  renderInner(){
    return (
      <div>
        {this.renderHelperText()}
        <h3>Choose a Target for your Check</h3>
        <EnvList onTargetSelect={this.handleTargetSelect} filter={this.props.filter} onFilterChange={this.props.onFilterChange}/>
      </div>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (1 of 4)" bg="info">
          <Button icon flat to="/">
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement>
                {this.renderInner()}
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
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckCreateTarget);