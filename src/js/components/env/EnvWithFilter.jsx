import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import forms from 'newforms';
import fuzzy from 'fuzzy';
import {List} from 'immutable';

import {Alert, Row, Col} from '../../modules/bootstrap';
import {SetInterval} from '../../modules/mixins';

import {BoundField, Button} from '../forms';
import {StatusHandler} from '../global';
import {Search, Circle} from '../icons';
import {GroupItemList} from '../groups';
import {InstanceItemList} from '../instances';
import {Padding} from '../layout';
import {env as actions, analytics as analyticsActions} from '../../actions';

const FilterForm = forms.Form.extend({
  filter: forms.CharField({
    label: 'Filter',
    widgetAttrs: {
      placeholder: 'What are you looking for?',
      noLabel: true
    },
    required: false
  }),
  render() {
    return (
      <Padding b={1}>
        <BoundField bf={this.boundField('filter')}>
          <Search className="icon"/>
        </BoundField>
      </Padding>
    );
  }
});

const EnvWithFilter = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    include: PropTypes.array,
    filter: PropTypes.string,
    onFilterChange: PropTypes.func,
    onTargetSelect: PropTypes.func,
    noModal: PropTypes.bool,
    limit: PropTypes.number,
    actions: PropTypes.shape({
      getGroupsSecurity: PropTypes.func,
      getGroupsElb: PropTypes.func,
      getInstancesEcc: PropTypes.func,
      getInstancesRds: PropTypes.func,
      envSetSearch: PropTypes.func
    }),
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object,
          elb: PropTypes.object
        }),
        instances: PropTypes.shape({
          ecc: PropTypes.object,
          rds: PropTypes.object
        }),
        bastions: PropTypes.array,
        search: PropTypes.string
      })
    })
  },
  getDefaultProps(){
    return {
      include: ['groupsSecurity', 'groupsELB', 'instancesRds', 'instancesECC']
    };
  },
  getInitialState() {
    const self = this;
    const obj = {
      filter: new FilterForm(_.assign({
        onChange: self.onFilterChange,
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 50
        }
      }, this.getFilter() ? {data: {filter: this.getFilter()}} : null)),
      attemptedGroupsSecurity: false,
      attemptedGroupsELB: false,
      attemptedInstancesECC: false,
      selected: _.get(this.props, 'check.target.id') || null
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    if (this.getFilter()){
      setTimeout(() => {
        this.state.filter.setData({filter: this.getFilter()});
      }, 50);
    }
    return _.extend(obj, {
      cleanedData: null
    });
  },
  componentWillMount(){
    this.getData();
    this.setInterval(this.getData, 25000);
  },
  getFilter(){
    return this.props.redux.env.search || this.props.filter;
  },
  getData(){
    this.props.actions.getGroupsSecurity();
    this.props.actions.getGroupsElb();
    this.props.actions.getInstancesEcc();
    this.props.actions.getInstancesRds();
  },
  getAll(){
    let arr = new List();
    const dataArray = [this.getGroupsSecurity(true), this.getGroupsELB(true), this.getInstancesECC(true), this.getInstancesRds(true)];
    const includes = ['groupsSecurity', 'groupsELB', 'instancesECC', 'instancesRds'];
    includes.forEach((include, i) => {
      if (this.props.include.indexOf(include) > -1){
        arr = arr.concat(dataArray[i]);
      }
    });
    return arr;
  },
  getNumberPassing(){
    return this.getAll().filter(item => {
      return item.get('state') === 'passing';
    }).size;
  },
  getNumberFailing(){
    return this.getAll().filter(item => {
      return item.get('state') === 'failing';
    }).size;
  },
  getNumberUnmonitored(){
    return this.getAll().filter(item => {
      return item.get('state') === 'running';
    }).size;
  },
  getFilteredItems(items, ignoreButtonState){
    const string = this.props.redux.env.search || this.state.filter.cleanedData.filter;
    let data = items.sortBy(item => {
      return item.get('health') || 101;
    });
    if (this.state.buttonSelected && !ignoreButtonState){
      data = data.filter(item => {
        return item.get('state') === this.state.buttonSelected;
      });
    }
    if (string){
      return data.filter(item => {
        return fuzzy.filter(string, [item.get('name'), item.get('id')]).length;
      });
    }
    return data;
  },
  getGroupsSecurity(ignoreButtonState){
    return this.getFilteredItems(this.props.redux.env.groups.security, ignoreButtonState);
  },
  getGroupsELB(ignoreButtonState){
    return this.getFilteredItems(this.props.redux.env.groups.elb, ignoreButtonState);
  },
  getInstancesECC(ignoreButtonState){
    return this.getFilteredItems(this.props.redux.env.instances.ecc, ignoreButtonState);
  },
  getInstancesRds(ignoreButtonState){
    return this.getFilteredItems(this.props.redux.env.instances.rds, ignoreButtonState);
  },
  isFinishedAttempt(){
    return this.props.redux.asyncActions.getGroupsSecurity.status;
  },
  shouldButtonsRender(){
    const arr = [this.getNumberUnmonitored(), this.getNumberFailing(), this.getNumberPassing()];
    return _.compact(arr).length > 1;
  },
  onFilterChange(){
    this.forceUpdate();
    const data =  this.state.filter.cleanedData.filter;
    this.props.analyticsActions.trackEvent('EnvWithFilter', 'filter-change', {data});
    this.props.actions.envSetSearch(data);
    if (this.props.onFilterChange){
      this.props.onFilterChange.call(null, data);
    }
  },
  runToggleButtonState(string){
    const state = this.state.buttonSelected;
    let obj = {};
    if (state === string){
      obj.buttonSelected = false;
    }else {
      obj.buttonSelected = string;
    }
    this.setState(obj);
  },
  renderGroupsSecurity(){
    if (this.props.redux.env.groups.security.size){
      return (
        <div key="groupsSecurity">
          <h3>Security Groups ({this.getGroupsSecurity().size})</h3>
          <GroupItemList groups={this.getGroupsSecurity()} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} limit={this.props.limit}/>
          <hr/>
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getGroupsSecurity.status} errorText="Something went wrong trying to get Security Groups." key="groupsSecurityStatus">
        <h3>Security Groups</h3>
        <Alert bsStyle="default">
          No security groups found
        </Alert>
        <hr/>
      </StatusHandler>
    );
  },
  renderGroupsELB(){
    if (this.props.redux.env.groups.security.size){
      return (
        <div key="groupsELB">
          <h3>ELBs ({this.getGroupsELB().size})</h3>
          <GroupItemList groups={this.getGroupsELB()} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} limit={this.props.limit}/>
          <hr/>
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getGroupsSecurity.status} errorText="Something went wrong trying to get ELB Groups." key="groupsELBStatus"/>
    );
  },
  renderInstancesECC(){
    if (this.props.redux.env.instances.ecc.size){
      return (
        <div key="instancesECC">
          <h3>EC2 Instances ({this.getInstancesECC().size})</h3>
          <InstanceItemList instances={this.getInstancesECC()} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} limit={this.props.limit}/>
          <hr/>
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getInstancesEcc.status} errorText="Something went wrong trying to get EC2 Instances." key="instancesECCStatus">
        <h3>EC2 Instances</h3>
        <Alert bsStyle="default">
          No EC2 Instances found
        </Alert>
        <hr/>
      </StatusHandler>
    );
  },
  renderInstancesRds(){
    if (this.props.redux.env.instances.ecc.size){
      return (
        <div key="instancesRds">
          <h3>RDS DB Instances ({this.getInstancesRds().size})</h3>
          <InstanceItemList instances={this.getInstancesRds()} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} type="RDS"/>
          <hr/>
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getInstancesRds.status} errorText="Something went wrong trying to get EC2 Instances." key="instancesRdsStatus">
        <h3>RDS DB Instances</h3>
        <Alert bsStyle="default">
          No RDS Instances found
        </Alert>
        <hr/>
      </StatusHandler>
    );
  },
  renderPassingButton(){
    if (this.getNumberPassing() > 0){
      return (
        <Col className="col-xs">
          <Padding b={1}>
            <Button flat={this.state.buttonSelected !== 'passing'} color="success" onClick={this.runToggleButtonState.bind(null, 'passing')}><Circle fill={this.state.buttonSelected !== 'passing' ? 'success' : ''} inline/> {this.getNumberPassing()} Passing</Button>
          </Padding>
        </Col>
      );
    }
    return <Col/>;
  },
  renderFailingButton(){
    if (this.getNumberFailing() > 0){
      return (
        <Col className="col-xs">
          <Padding b={1}>
            <Button flat={this.state.buttonSelected !== 'failing'} color="danger" onClick={this.runToggleButtonState.bind(null, 'failing')}><Circle fill={this.state.buttonSelected !== 'failing' ? 'danger' : ''} inline/> {this.getNumberFailing()} Failing</Button>
          </Padding>
        </Col>
      );
    }
    return <Col/>;
  },
  renderUnmonitoredButton(){
    if (this.getNumberUnmonitored() > 0){
      return (
        <Col className="col-xs">
          <Padding b={1}>
            <Button flat={this.state.buttonSelected !== 'running'} onClick={this.runToggleButtonState.bind(null, 'running')}><Circle fill={this.state.buttonSelected !== 'running' ? 'text' : ''} inline/> {this.getNumberUnmonitored()} Unmonitored</Button>
          </Padding>
        </Col>
      );
    }
    return <Col/>;
  },
  renderFilterButtons(){
    if (this.shouldButtonsRender()){
      return (
        <Padding b={1}>
          <Row>
            {this.renderFailingButton()}
            {this.renderPassingButton()}
            {this.renderUnmonitoredButton()}
          </Row>
        </Padding>
      );
    }
    return null;
  },
  render(){
    const self = this;
    // if (this.isFinishedAttempt()){
    return (
      <form name="envWithFilterForm">
        {this.state.filter.render()}
        {this.renderFilterButtons()}
        {this.props.include.map(i => {
          return self[`render${_.capitalize(i)}`]();
        })}
      </form>
    );
    // }
    // return <StatusHandler status="pending"/>;
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  analyticsActions: bindActionCreators(analyticsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EnvWithFilter);