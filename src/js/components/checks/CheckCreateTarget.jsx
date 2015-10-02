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
import CheckResponse from './CheckResponse.jsx';
import {GroupItemList} from '../groups';

const groupOptions = []

const verbOptions = ['GET','POST','PUT','DELETE','PATCH'].map(name => [name, name]);

const FilterForm = forms.Form.extend({
  filter: forms.CharField({
    label:'Filter',
    widgetAttrs:{
      placeholder:'group:target-group'
    },
    required:false
  }),
  render() {
    return <BoundField bf={this.boundField('filter')}/>
  }
});

const CheckStepTargetSelect = React.createClass({
  mixins:[GroupStore.mixin],
  storeDidChange(){
    const getGroupsStatus = GroupStore.getGetGroupsSecurityStatus();
    let stateObj = {};
    if(getGroupsStatus == 'success'){
      stateObj.groupsSecurity = GroupStore.getGroupsSecurity();
    }
    this.setState(_.assign(stateObj,{getGroupsStatus}));
  },
  getInitialState() {
    const self = this;
    const initialHeaders = this.props.check.check_spec.value.headers;
    const obj = {
      filter: new FilterForm(_.extend({
        onChange:self.filterHasChanged,
        labelSuffix:'',
      }, self.dataComplete() ? {data:{id:self.props.check.target.id}} : null)),
      check:this.props.check,
      groupsSecurity:GroupStore.getGroupsSecurity()
    }
    //this is a workaround because the library is not working correctly with initial + data formset
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
    return this.state.check.id ? <Link to="check" params={{id:this.state.check.id}} className="btn btn-primary btn-fab" title="Edit {check.name}"/> : <div/>;
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
      return this.state.groupsSecurity.filter(sg => {
        return fuzzy.filter(string, [sg.get('name')]).length;
      });
    }else{
      return this.state.groupsSecurity;
    }
  },
  clickedGroup(id){
    console.log(id);
  },
  renderGroupsSecurity(){
    return (
      <div>
        <h3>Security Groups</h3>
        <GroupItemList groups={this.getGroupsSecurity()} noLink={true} onClick={this.clickedGroup}/>
      </div>
    )  
  },
  renderHelperText(){
      return (
        <UserDataRequirement hideIf="hasDismissedCheckCreationHelp">
          <Alert type="info" onDismiss={this.dismissHelperText}>
            <p>Let’s create your first health check! Tell us which security group to check, and Opsee will apply it to the right instances.<br/>Only HTTP checks are supported right now.</p>
          </Alert>
          <div><br/></div>
        </UserDataRequirement>
      )
  },
  innerRender(){
    return (
      <form name="checkStep1Form" ref="form" onSubmit={this.submit}>
        {this.renderHelperText()}
        {this.state.filter.render()}
        {this.renderGroupsSecurity()}
        {this.renderSubmitButton()}
      </form>
    )
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check: Select A Target">
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