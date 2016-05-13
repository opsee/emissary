/* eslint-disable */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {History} from 'react-router';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Heading} from '../type';
import {Button} from '../forms';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import {Highlight, ProgressBar, Toolbar} from '../global';
import instanceImg from '../../../img/tut-ec2-instance.svg';
import style from './onboard.css';

const ReviewInstance = React.createClass({
  componentWillMount(){
    // Optimistically scan region for the VPC/subnet selection steps
    // this.props.actions.scanRegion(this.props.redux.onboard.region);

    // Grab the URL template to populate the AWS console links
    const item = this.props.redux.asyncActions.onboardGetTemplates;
    if (!item.status){
      this.props.actions.getTemplates();
    }
  },
  getInitialState(){
    return {
      showDetails: false
    };
  },
  renderTemplateItem(title){
    const arr = ['ingress', 'cf', 'role'];
    const base = 'https://s3.amazonaws.com/opsee-bastion-cf-us-east-1/beta';
    const links = ['bastion-ingress-cf.template', 'bastion-cf.template', 'opsee-role.json'];
    const index = arr.indexOf(title);
    const data = this.props.redux.onboard.templates[index];
    if (data){
      return (
        <Padding b={2}>
          <Expandable style={{background: seed.color.gray9}}>
            <Highlight style={{padding: '1rem'}}>
              {data.text}
            </Highlight>
          </Expandable>
          <p><small className="text-muted">Last modified: {data.headers['last-modified']}</small></p>
        </Padding>
      );
    } else if (typeof this.props.redux.asyncActions.onboardGetTemplates.status === 'object'){
      return (
        <Padding b={1}>
          <a href={`${base}/${links[index]}`} target="_blank">View File</a>
        </Padding>
      );
    }
    return null;
  },
  renderInner(){
    if (this.state.showDetails) {
      return (
        <div>
          <Row className="middle-xs">
            <Col xs={12}>
              <Padding tb={1}>
                <h2>About the Opsee EC2 instance</h2>
              </Padding>
              <p>The instance is <a href="https://aws.amazon.com/ec2/instance-types/" target="_blank">a t2.micro and is free-tier eligible</a>. It's responsible for running checks,
              and it inherits all of its permissions from the cross-account role you set up in the last step.
              The instance is controlled by both a CloudFormation template and an Ingress IAM Role,
              which are both available <a href="/docs/permissions" target="_blank">in our documentation</a>.</p>
              <p>If you'd like to know more, reach out to us any time on <a href="mailto:support@opsee.co">email</a>, <a href="https://opsee-support.slack.com" target="_blank">Slack</a>, or <a href="irc://irc.freenode.org/opsee" target="_blank">IRC</a>.</p>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Padding tb={1}>
                <Heading level={4}>Instance CloudFormation Template</Heading>
                <p>Used to install our EC2 instance. Notably, we create a security group and auto-scale group (to set rules requiring at least one running Opsee instance at all times), and add our instance to both groups.</p>
                {this.renderTemplateItem('cf')}
              </Padding>

              <Padding tb={1}>
                <Heading level={4}>Ingress IAM Role</Heading>
                <p>Used to ensure communication between your security groups and the Opsee security group within your chosen VPC.</p>
                {this.renderTemplateItem('ingress')}
              </Padding>
            </Col>
          </Row>          <Padding tb={1}>
            <Button onClick={this.setState.bind(this, {showDetails: false})} color="primary" block>Got it</Button>
          </Padding>
        </div>
      );
    }

    return (
      <Row>
        <Col xs={12}>
          <Padding lr={4} tb={2} className="text-center">
            <img src={instanceImg} style={{maxHeight: '300px'}}/>
          </Padding>

          <Padding tb={2}>
            <h2>About the Opsee EC2 instance</h2>
          </Padding>

          <p>Our EC2 instance is responsible for running checks in your AWS environment.</p>
          <p>The instance is controlled by both a CloudFormation template and an Ingress IAM Role,
          which are both available <a href="/docs/permissions" target="_blank">in our documentation</a>.
          You can manage it any time from your AWS console.</p>

          <Padding tb={1}>
            <Button onClick={this.setState.bind(this, {showDetails: true})} color="primary" block>More about the instance</Button>
          </Padding>
          <Padding tb={1}>
            <Button to="/start/launch-instance" color="success" block chevron>Continue</Button>
          </Padding>
        </Col>
      </Row>
    );
  },
  render(){
    return (
      <div className={style.transitionPanel}>
        <Grid>
          {this.renderInner()}
        </Grid>
      </div>
    );
  }
})

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewInstance);
