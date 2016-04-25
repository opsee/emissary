import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {History} from 'react-router';

import {Button} from '../forms';
import {BastionRequirement, Toolbar} from '../global';
import {Close} from '../icons';
import {UserDataRequirement} from '../user';
import {EnvList} from '../env';
import {Alert, Col, Grid, Padding, Row} from '../layout';
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
    }).isRequired,
    history: PropTypes.shape({
      pushState: PropTypes.func.isRequired
    }).isRequired
  },
  getInclude(){
    let data = this.props.location.query.data;
    if (data && typeof data === 'string'){
      data = JSON.parse(data);
    }
    data = data || {};
    data = _.defaults(data, {target: {}});
    const type = data.target.type;
    if (type){
      switch (type){
      case 'security':
        return ['groups.security'];
      case 'elb':
        return ['groups.elb'];
      case 'EC2':
      case 'ecc':
        return ['instances.ecc'];
      case 'rds':
      case 'RDS':
        return ['instances.rds'];
      default:
        break;
      }
    }
    return ['groups.elb', 'groups.security', 'instances.ecc'];
  },
  isDisabled(){
    return false;
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckTargetHelp');
  },
  handleTargetSelect(item){
    let check = this.props.check ? _.cloneDeep(this.props.check) : new Check().toJS();
    check.target = item.toJS ? item.toJS() : item;
    check.target = _.pick(check.target, ['id', 'name', 'type']);
    this.props.onChange(check);
    const data = JSON.stringify(check);
    if (this.props.check.target.type === 'rds'){
      return this.props.history.pushState(null, `/check-create/assertions-cloudwatch?data=${data}`);
    }
    return this.history.pushState(null, `/check-create/request?data=${data}`);
  },
  renderHelperText(){
    return (
      <UserDataRequirement hideIf="hasDismissedCheckTargetHelp">
        <Padding b={2}>
          <Alert color="success" onDismiss={this.runDismissHelperText}>
            Now, choose your target.
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