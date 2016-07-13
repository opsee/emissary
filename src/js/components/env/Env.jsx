import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link, State} from 'react-router';
import _ from 'lodash';

import {BastionRequirement, Toolbar} from '../global';
import {Col, Grid, Row, Padding} from '../layout';
import {Button} from '../forms';
import EnvList from './EnvList.jsx';
import instanceImg from '../../../img/tut-ec2-instance.svg';
import {
  env as actions,
  checks as checkActions
} from '../../actions';

const Env = React.createClass({
  mixins: [State],
  propTypes: {
    location: PropTypes.object,
    actions: PropTypes.shape({
      envSetSearch: PropTypes.func,
      getBastions: PropTypes.func,
      all: PropTypes.func
    }),
    checkActions: PropTypes.shape({
      getChecks: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        search: PropTypes.string,
        bastions: PropTypes.array,
        activeBastion: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.checkActions.getChecks();
    this.props.actions.all();
  },
  getTitle(){
    const bastion = _.chain(this.props.redux.env.bastions).filter('connected').last().value() || {};
    const region = bastion.region || 'Environment';
    const vpcId = bastion.vpc_id ? `- ${bastion.vpc_id}` : '';
    return `${region} ${vpcId}`;
  },
  getIncludes(){
    const {pathname} = this.props.location;
    let include = ['groups.elb', 'groups.security', 'groups.asg', 'instances.rds', 'instances.ecc'];
    if (pathname){
      if (pathname.match('groups-security')){
        include = ['groups.security'];
      } else if (pathname.match('groups-elb')){
        include = ['groups.elb'];
      } else if (pathname.match('instances-ec2')){
        include = ['instances.ecc'];
      }
    }
    return include;
  },
  renderAWSPrompt(){
    if (!!this.props.redux.env.activeBastion) {
      return null;
    }
    return (
      <div>
        <p>To run checks in AWS, add our EC2 instance. We&rsquo;ll automatically detect your infrastructure and services, and help you check everything in your environment. Learn more about <Link to="/docs/bastion">our AWS integration</Link>.</p>
        <Padding tb={2}>
          <Button to="/start/launch-stack" color="primary" block chevron>Add our instance</Button>
        </Padding>
        <Padding a={4} className="text-center">
          <img src={instanceImg} style={{maxHeight: '300px'}}/>
        </Padding>
      </div>
    );
  },
  renderInner(){
    if (!this.props.redux.env.activeBastion) {
      return this.renderAWSPrompt();
    }
    return (
      <BastionRequirement strict>
        <EnvList include={this.getIncludes()} limit={this.getIncludes() && this.getIncludes().length === 1 ? 1000 : 8} redux={this.props.redux} showFilterButtons/>
      </BastionRequirement>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title={this.getTitle()}/>
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
  checkActions: bindActionCreators(checkActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Env);