import React from 'react';
import _ from 'lodash';
import forms from 'newforms';
import colors from 'seedling/colors';
import fuzzy from 'fuzzy';
import Immutable, {Record, List, Map} from 'immutable';
import {Link} from 'react-router';

import router from '../../modules/router';
import config from '../../modules/config';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';

import {BoundField, Button} from '../forms';
import {Toolbar, StepCounter, Loader, StatusHandler} from '../global';
import {Close, Add} from '../icons';
import {UserDataRequirement} from '../user';
import {UserActions, GroupActions} from '../../actions';
import {GroupStore, CheckStore} from '../../stores';
import {GroupItemList} from '../groups';
import {EnvWithFilter} from '../env';

const groupOptions = []

const verbOptions = ['GET','POST','PUT','DELETE','PATCH'].map(name => [name, name]);

const CheckStepTargetSelect = React.createClass({
  getInitialState() {
    const self = this;
    const obj = {
      selected:this.props.check.target.id
    }
    return _.extend(obj, {
      cleanedData:null
    });
  },
  filterHasChanged(){
    this.forceUpdate();
  },
  dataComplete(){
    return this.props.check.target.id;
  },
  componentWillMount(){
    GroupActions.getGroupsSecurity();
    GroupActions.getGroupsELB();
  },
  componentDidMount(){
    if(this.props.renderAsInclude){
      this.changeAndUpdate();
    }
  },
  changeAndUpdate(){
    let data = this.getFinalData();
    this.props.onChange(data, this.disabled(), 1);
  },
  getFinalData(){
    let check = CheckStore.newCheck().toJS();
    check.target.id = this.state.selected;
    check.target.type = this.state.selectedType;
    return check;
  },
  renderSubmitButton(){
    if(!this.props.renderAsInclude){
      return(
        <div>
          <div><br/><br/></div>
          <div>
            <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()} title={this.disabled() ? 'Complete the form to move on.' : 'Define Assertions'} chevron={true}>Next: Define Assertions</Button>
          </div>
          <StepCounter active={1} steps={3}/>
        </div>
      )
    }else{
      return <div/>
    }
  },
  renderLink(){
    return this.props.check.id ? <Link to="check" params={{id:this.props.check.id}} className="btn btn-primary btn-fab" title="Edit {check.name}"/> : <div/>;
  },
  submit(e){
    e.preventDefault();
    router.transitionTo('checkCreateRequest');
  },
  disabled(){
    return false;
  },
  dismissHelperText(){
    UserActions.userPutUserData('hasDismissedCheckCreationHelp');
  },
  getGroupsSecurity(){
    const string = this.state.filter.cleanedData.filter;
    if(string){
      const data = this.state.groupsSecurity.filter(sg => {
        return fuzzy.filter(string, [sg.get('name')]).length;
      });
      return data;
    }else{
      return this.state.groupsSecurity;
    }
  },
  getGroupsELB(){
    const string = this.state.filter.cleanedData.filter;
    if(string){
      return this.state.groupsELB.filter(elb => {
        return fuzzy.filter(string, [elb.get('name')]).length;
      });
    }else{
      return this.state.groupsELB;
    }
  },
  onSelect(id, type){
    let check = CheckStore.newCheck().toJS();
    check.target.id = id;
    check.target.type = type || 'sg';
    this.setState({
      selected:check.target.id,
      selectedType:type
    });
    this.props.onChange(check, this.disabled(), 1);
    router.transitionTo('checkCreateRequest');
  },
  renderHelperText(){
      return (
        <UserDataRequirement hideIf="hasDismissedCheckCreationHelp">
          <Alert type="info" onDismiss={this.dismissHelperText}>
            <p>Let’s create your first health check! Tell us which group to check, and Opsee will apply it to the right instances.<br/>Only HTTP checks are supported right now.</p>
          </Alert>
          <div><br/></div>
        </UserDataRequirement>
      )
  },
  innerRender(){
    return (
      <div>
        <div className="padding-b-md">
          <h2>Select a Target</h2>
          <p>Tap an environment target to continue.</p>
        </div>
        {this.renderHelperText()}
        <EnvWithFilter onSelect={this.onSelect} include={['groupsSecurity','groupsELB']}/>
      </div>
    )
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (1 of 4)">
          <Link to="checks" className="btn btn-icon btn-flat">
            <Close btn={true}/>
          </Link>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
                {this.innerRender()}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  },
  render() {
    return this.props.renderAsInclude ? this.innerRender() : this.renderAsPage();
  },
})

export default CheckStepTargetSelect;