import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {Button} from '../forms';
import {BastionRequirement, StatusHandler, Toolbar} from '../global';
import {Close} from '../icons';
import {UserDataRequirement} from '../user';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {checks as actions, user as userActions} from '../../actions';
import {flag} from '../../modules';

const CheckCreateType = React.createClass({
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool,
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    types: PropTypes.array.isRequired,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        getGroupsSecurity: PropTypes.object
      }),
      env: PropTypes.shape({
        activeBastion: PropTypes.object,
        groups: PropTypes.shape({
          security: PropTypes.object,
          elb: PropTypes.object,
          asg: PropTypes.object
        }),
        instances: PropTypes.shape({
          ecc: PropTypes.object,
          rds: PropTypes.object
        })
      })
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentWillMount(){
    const hasActiveBastion = !!this.props.redux.env.activeBastion;
    if (flag('check-type-external_host') && !hasActiveBastion) {
      this.handleTargetSelect({id: 'external_host'});
    }
  },
  getLink(type = {}){
    const data = JSON.stringify({target: {type: type.id}});
    if (type.id === 'host' || type.id === 'external_host'){
      return `/check-create/request?data=${data}`;
    }
    return `/check-create/target?data=${data}`;
  },
  getStatus(){
    // Nothing to query if URL checks are the only available type
    if (!this.props.redux.env.activeBastion) {
      return 'success';
    }
    return this.props.redux.asyncActions.getGroupsSecurity.status;
  },
  getTargets(){
    return this.props.types;
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckTypeHelp');
  },
  handleTargetSelect(target, type = 'http'){
    let check = _.cloneDeep(this.props.check);
    check.type = type;
    check.target.type = target.id;
    this.props.onChange(check);

    const data = JSON.stringify(check);
    let path = `/check-create/target?data=${data}`;
    if (target.id === 'host' || target.id === 'external_host'){
      path = `/check-create/request?data=${data}`;
    }
    this.context.router.push(path);
  },
  renderBastionPrompt(){
    if (!!this.props.redux.env.activeBastion) {
      return null;
    }
    return (
      <Padding t={3} b={2}>
        <Link to="/start/launch-stack">Connect to AWS</Link> to set up health checks for ELBs, security groups, EC2 instances, RDS, and more.
      </Padding>
    );
  },
  renderHelperText(){
    return (
      <UserDataRequirement hideIf="hasDismissedCheckTypeHelp">
        <Padding b={2}>
          <Alert color="success" onDismiss={this.runDismissHelperText}>
          Let’s create a check! The first step is to choose your target type. If you choose a Security Group, Auto Scaling Group, or ELB, Opsee will automatically check all of its instances, even if it changes.
          </Alert>
        </Padding>
      </UserDataRequirement>
    );
  },
  renderInner(){
    return (
      <div>
        {this.renderHelperText()}
        <Padding b={1}>
          <Heading level={3}>Choose a Target Type</Heading>
        </Padding>
        <StatusHandler status={this.getStatus()}>
          {this.getTargets().map(target => {
            return (
              <Button onClick={this.handleTargetSelect.bind(null, target, target.types[0])} style={{margin: '0 1rem 1rem 0'}} color="primary" flat key={`${target.id}-type-select`}>
                {target.title}{target.size() && ` (${target.size()})`}
              </Button>
            );
          })}
        </StatusHandler>
        <p><em className="small text-muted">Learn more about the different kinds of health checks in our <a target="_blank" href="/docs/checks">health check docs</a>.</em></p>
        {this.renderBastionPrompt()}
      </div>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create a Check" bg="info">
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckCreateType);