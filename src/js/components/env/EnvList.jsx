import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {List} from 'immutable';

import analytics from '../../modules/analytics';
import {Row, Col} from '../../modules/bootstrap';
import {SetInterval} from '../../modules/mixins';
import {itemsFilter} from '../../modules';

import {Button} from '../forms';
import {Circle} from '../icons';
import {GroupItemList} from '../groups';
import {InstanceItemList} from '../instances';
import {Padding} from '../layout';
import {env as actions} from '../../actions';

const EnvList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    include: PropTypes.array,
    filter: PropTypes.bool,
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
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      search: PropTypes.shape({
        string: PropTypes.string
      }),
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
      include: ['groupsSecurity', 'groupsELB', 'instancesRds', 'instancesECC'],
      limit: 1000
    };
  },
  getInitialState() {
    return {
      attemptedGroupsSecurity: false,
      attemptedGroupsELB: false,
      attemptedInstancesECC: false
    };
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
    let data = items.sortBy(item => {
      return item.get('health') || 101;
    });
    if (this.state.buttonSelected && !ignoreButtonState){
      data = data.filter(item => {
        return item.get('state') === this.state.buttonSelected;
      });
    }
    if (this.props.filter){
      data = itemsFilter(data, this.props.redux.search);
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
    analytics.event('EnvList', 'filter-change', {data});
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
    return (
      <div key="groupsSecurity">
        <GroupItemList filter={this.props.filter} type="security" onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="Security Groups"/>
        <hr/>
      </div>
    );
  },
  renderGroupsELB(){
    return (
      <div key="groupsELB">
        <GroupItemList type="elb" filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="ELBs"/>
        <hr/>
      </div>
    );
  },
  renderInstancesECC(){
    return (
      <div key="instancesECC">
        <h3>EC2 Instances ({this.getInstancesECC().size})</h3>
        <InstanceItemList filter={this.props.filter} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} limit={this.props.limit} type="ecc"/>
        <hr/>
      </div>
    );
  },
  renderInstancesRds(){
    return (
      <div key="instancesRds">
        <h3>RDS DB Instances ({this.getInstancesRds().size})</h3>
        <InstanceItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} type="rds"/>
        <hr/>
      </div>
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
    return <div/>;
  },
  render(){
    const self = this;
    return (
      <form name="envWithFilterForm">
        {this.props.include.map(i => {
          return self[`render${_.capitalize(i)}`]();
        })}
      </form>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EnvList);