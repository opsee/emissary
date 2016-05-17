import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import {Highlight} from '../global';
import style from './onboard.css';

const ReviewInstance = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        templates: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        onboardGetTemplates: PropTypes.object
      })
    }),
    actions: PropTypes.shape({
      getTemplates: PropTypes.func
    })
  },
  componentWillMount(){
    // Grab the URL template to populate the AWS console links
    const item = this.props.redux.asyncActions.onboardGetTemplates;
    if (!item.status){
      this.props.actions.getTemplates();
    }
  },
  renderTemplateItem(title){
    const arr = ['ingress', 'cf', 'role'];
    const base = 'https://s3.amazonaws.com/opsee-bastion-cf-us-east-1/beta';
    const links = ['bastion-ingress-cf.template', 'bastion-cf.template', 'opsee-role.json'];
    const index = arr.indexOf(title);
    const data = this.props.redux.onboard.templates[index];
    if (data){
      return (
        <Padding tb={1}>
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
  render(){
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={2}>
                <h2>About the Opsee EC2 instance</h2>
              </Padding>
              <p>The Opsee Bastion instance is a <a href="https://aws.amazon.com/ec2/instance-types/" target="_blank">free-tier eligible t2.micro</a> and is responsible for running checks in your environment.
              The instance is provisioned and managed with CloudFormation via cross-account access using the IAM role created during onboarding.
              Both CloudFormation templates are available in <a href="/docs/permissions" target="_blank">our documentation</a>.</p>
              <Padding tb={1}>
                <h4>Instance CloudFormation Template</h4>
                <p>Used to install and manage our EC2 instance. Notably, we create a nested CloudFormation stack to manage security group changes (to allow network access to your instances from our EC2 instance) and an autoscaling group (to both manage deploying new code to the instance and ensure an instance is always running).</p>
                {this.renderTemplateItem('cf')}
              </Padding>
              <Padding b={1}>
                <h4>IAM Role</h4>
                <p>Our IAM role in your AWS account allows us to manage the bastion on your behalf, enable network access to your EC2 instances from our bastion, and ensure our instance always has the latest information about your environment.</p>
                {this.renderTemplateItem('ingress')}
              </Padding>
              <p>If you'd like to know more, reach out to us any time on <a href="mailto:support@opsee.co">email</a>, <a href="https://opsee-support.slack.com" target="_blank">Slack</a>, or <a href="irc://irc.freenode.org/opsee" target="_blank">IRC</a>.</p>
              <Padding tb={2}>
                <Button to="/start/launch-instance" color="primary" block>Got it</Button>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewInstance);
