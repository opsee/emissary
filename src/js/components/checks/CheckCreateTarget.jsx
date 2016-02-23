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
import {Heading} from '../type';
import {Check} from '../../modules/schemas';
import {Bar as SearchBar} from '../search';
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
    }),
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired
  },
  getInitialState() {
    return {
      cleanedData: null
    };
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
  getInclude(){
    let include = ['groups.elb', 'groups.security', 'instances.ecc'];
    const type = this.props.location.query.type;
    if (type){
      switch (type){
      case 'security':
        include = ['groups.security'];
        break;
      case 'elb':
        include = ['groups.elb'];
        break;
      case 'EC2':
      case 'ecc':
        include = ['instances.ecc'];
        break;
      default:
        break;
      }
    }
    return include;
  },
  isDisabled(){
    return false;
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckTargetHelp');
  },
  handleSubmit(e){
    e.preventDefault();
    this.history.pushState(null, '/check-create/request');
  },
  handleTargetSelect(item){
    let check = this.props.check ? _.cloneDeep(this.props.check) : new Check().toJS();
    check.target = item.toJS ? item.toJS() : item;
    this.props.onChange(check, null, 1);
    this.history.pushState(null, '/check-create/request', {id: check.target.id, type: check.target.type, name: check.target.name});
  },
  renderHelperText(){
    return (
      <UserDataRequirement hideIf="hasDismissedCheckTargetHelp">
        <Padding b={2}>
          <Alert bsStyle="success" onDismiss={this.runDismissHelperText}>
            <p>Now, choose your target.</p>
          </Alert>
        </Padding>
      </UserDataRequirement>
    );
  },
  renderInner(){
    return (
      <div>
        {this.renderHelperText()}
        <Padding b={2}>
          <Heading level={3}>Choose a Target for your Check</Heading>
          <SearchBar noRedirect id="check-create-search"/>
        </Padding>
        <EnvList onTargetSelect={this.handleTargetSelect} onFilterChange={this.props.onFilterChange} include={this.getInclude()} noFetch filter/>
      </div>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (2 of 5)" bg="info">
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