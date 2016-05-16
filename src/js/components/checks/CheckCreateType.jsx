import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

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
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        getGroupsSecurity: PropTypes.object
      }),
      env: PropTypes.shape({
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
  getLink(type = {}){
    const data = JSON.stringify({target: {type: type.id}});
    if (type.id === 'host'){
      return `/check-create/request?data=${data}`;
    }
    return `/check-create/target?data=${data}`;
  },
  getTypes(){
    const initial = [
      {
        id: 'elb',
        title: 'ELB',
        size: () => this.props.redux.env.groups.elb.size
      },
      {
        id: 'security',
        title: 'Security Group',
        size: () => this.props.redux.env.groups.security.size
      },
      {
        id: 'asg',
        title: 'Auto Scaling Group',
        size: () => this.props.redux.env.groups.asg.size
      },
      {
        id: 'ecc',
        title: 'EC2 Instance',
        size: () => this.props.redux.env.instances.ecc.size
      },
      {
        id: 'rds',
        title: 'RDS Instance',
        size: () => this.props.redux.env.instances.rds.size
      },
      {
        id: 'host',
        title: 'URL',
        size: () => ''
      }
    ];
    return _.chain(initial).filter(type => {
      return flag(`check-type-${type.id}`);
    })
    .filter(type => {
      return type.size() > 0 || type.id === 'host';
    })
    .value();
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckTypeHelp');
  },
  handleTypeSelect(type){
    let check = _.cloneDeep(this.props.check);
    check.target.type = type.id;
    this.props.onChange(check);

    const data = JSON.stringify({target: {type: type.id}});
    let path = `/check-create/target?data=${data}`;
    if (type.id === 'host'){
      path = `/check-create/request?data=${data}`;
    }
    this.context.router.push(path);
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
        <StatusHandler status={this.props.redux.asyncActions.getGroupsSecurity.status}>
          {this.getTypes().map(type => {
            return (
              <Button onClick={this.handleTypeSelect.bind(null, type)} style={{margin: '0 1rem 1rem 0'}} color="primary" flat key={`type-select-${type.id}`}>
                <strong>{type.title}&nbsp;</strong>
                <span style={{display: 'inline-block', textAlign: 'left'}}>
                  {type.size()}
                </span>
              </Button>
            );
          })}
        </StatusHandler>
      </div>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (1 of 5)" bg="info">
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