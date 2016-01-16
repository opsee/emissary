import React, {PropTypes} from 'react';
import _ from 'lodash';
import colors from 'seedling/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Toolbar, StatusHandler} from '../global';
import CheckCreateRequest from './CheckCreateRequest.jsx';
import CheckCreateAssertions from './CheckCreateAssertions.jsx';
import CheckCreateInfo from './CheckCreateInfo.jsx';
import {Checkmark, Close, Delete} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {EnvList} from '../env';
import {Button} from '../forms';
import {checks as actions, env as envActions} from '../../actions';
import {Check} from '../../modules/schemas';

function getState(){
  return {
    step1: {
      disabled: false
    },
    step2: {
      disabled: false
    },
    step3: {
      disabled: false
    }
  };
}

const CheckEdit = React.createClass({
  propTypes: {
    params: PropTypes.object,
    onFilterChange: PropTypes.func,
    filter: PropTypes.string,
    actions: PropTypes.shape({
      getCheck: PropTypes.func,
      del: PropTypes.func,
      edit: PropTypes.func,
      testCheckReset: PropTypes.func
    }),
    envActions: PropTypes.shape({
      getGroupsSecurity: PropTypes.func,
      getGroupsElb: PropTypes.func,
      getInstancesEcc: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object
      }),
      asyncActions: PropTypes.shape({
        checkEdit: PropTypes.object,
        getCheck: PropTypes.object
      })
    })
  },
  getInitialState() {
    return _.assign(getState(), {
      check: null,
      showEnv: false
    });
  },
  componentWillMount(){
    this.props.actions.getCheck(this.props.params.id);
    this.props.envActions.getGroupsSecurity();
    this.props.envActions.getGroupsElb();
    this.props.envActions.getInstancesEcc();
    this.props.actions.testCheckReset();
  },
  componentWillReceiveProps(nextProps) {
    const data = nextProps.redux.checks.checks.find(g => {
      return g.get('id') === this.props.params.id;
    }) || new Check();
    const check = data.toJS();
    if (!this.state.check && check.assertions.length){
      this.setState({
        check
      });
    }
  },
  getCheck(){
    return this.state.check || new Check().toJS();
  },
  getCheckTitle(){
    return _.get(this, 'state.check.check_spec.value.name') || 'Check';
  },
  isDisabled(){
    return this.state.step1.disabled || this.state.step2.disabled || this.state.step3.disabled;
  },
  runRemoveCheck(){
    this.props.actions.del(this.props.params.id);
  },
  setData(data, disabled, num){
    let obj = {};
    obj[`step${num}`] = {disabled: disabled};
    obj.check = _.cloneDeep(data);
    this.setState(obj);
  },
  setShowEnv(){
    const bool = this.state.showEnv;
    this.setState({showEnv: !bool});
  },
  handleSubmit(){
    return this.props.actions.edit(this.getCheck());
  },
  handleTargetSelect(id, type){
    let check = _.cloneDeep(this.getCheck());
    check.target.id = id;
    check.target.type = type || 'sg';
    this.setData(check);
    this.setShowEnv();
  },
  renderEnv(){
    if (this.state.showEnv){
      return (
        <Padding tb={1}>
          <EnvList onTargetSelect={this.handleTargetSelect} include={['groups.elb', 'groups.security', 'instances.ecc']} filter={this.props.filter} onFilterChange={this.props.onFilterChange}/>
        </Padding>
      );
    }
    return null;
  },
  renderLink(){
    return this.getCheck().id ?
    (
      <Button to={`/check/${this.getCheck().id}`} icon flat title="Return to Check">
        <Close btn/>
      </Button>
    )
     : <div/>;
  },
  renderInner(){
    if (this.getCheck().id){
      return (
        <div>
          {this.renderEnv()}
          <Padding tb={1}>
            <CheckCreateRequest check={this.getCheck()} onChange={this.setData} renderAsInclude/>
          </Padding>
          <Padding tb={1}>
            <CheckCreateAssertions check={this.getCheck()} onChange={this.setData} renderAsInclude/>
          </Padding>
          <Padding tb={1}>
            <CheckCreateInfo check={this.getCheck()} onChange={this.setData} renderAsInclude/>
          </Padding>
          <Padding t={1}>
          <StatusHandler status={this.props.redux.asyncActions.checkEdit.status}/>
          <Button color="success" block type="submit" onClick={this.handleSubmit} disabled={this.isDisabled()}>
            Finish <Checkmark inline fill={colors.success}/>
          </Button>
          </Padding>
          <Padding t={4}>
            <Padding t={4}>
              <Button onClick={this.runRemoveCheck} flat color="danger">
                <Delete inline fill="danger"/> Delete Check
              </Button>
            </Padding>
          </Padding>
        </div>
      );
    }else if (!this.getCheck().assertions.length){
      return <StatusHandler status="pending"/>;
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getCheck.status}>
        <h2>Check not found.</h2>
      </StatusHandler>
    );
  },
  render() {
    return (
      <div>
        <Toolbar btnPosition="midRight" title={`Edit ${this.getCheckTitle()}`} bg="info">
          {this.renderLink()}
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
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  envActions: bindActionCreators(envActions, dispatch)
});

export default connect(null, mapDispatchToProps)(CheckEdit);