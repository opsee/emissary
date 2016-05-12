import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Highlight, ProgressBar, Toolbar} from '../global';
import {Expandable, Padding, Grid, Row, Col} from '../layout';
import {Heading} from '../type';
import ec2InstaceImage from '../../../img/tut-ec2-instance.svg';
import style from './onboard.css';

const AddInstance = React.createClass({
  propTypes: {
    location: PropTypes.shape({
      query: PropTypes.shape({
        region: PropTypes.string
      })
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        onboardGetTemplates: PropTypes.object
      }),
      onboard: PropTypes.shape({
        region: PropTypes.string,
        templates: PropTypes.array
      })
    }),
    actions: PropTypes.shape({
      getTemplates: PropTypes.func,
      scanRegion: PropTypes.func
    }),
    history: PropTypes.shape({
      pushState: PropTypes.func,
      replaceState: PropTypes.func
    }).isRequired
  },
  componentWillMount(){
    if (!this.props.redux.onboard.region) {
      this.props.history.replaceState(null, '/start/choose-region');
    }
    // Optimistically scan region for the VPC/subnet selection steps
    this.props.actions.scanRegion(this.props.redux.onboard.region);
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
  render() {
    return (
      <div>
        <Toolbar title="Step 2: Add our EC2 Instance" className={style.toolbar} />
        <Padding b={2}>
          <ProgressBar percentage={45} color={seed.color.success} flat />
        </Padding>

        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={2}>
                <p>Now we're going to add our EC2 instance to your environment. <strong>This is the last step in installation... hooray!</strong></p>
              </Padding>
            </Col>
          </Row>

          <Row className="middle-xs">
            <Col xs={12} sm={4} style={{textAlign: 'center'}}>
              <Padding a={2}>
                <img src={ec2InstaceImage} alt="Our EC2 instance inside your AWS environment" style={{width: '100%', maxWidth: '200px'}} />
              </Padding>
            </Col>
            <Col xs={12} sm={8}>
              <Heading level={3}>Our EC2 Instance</Heading>
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
          </Row>

          <Row>
            <Col xs={12}>
              <p>In the next step, you'll choose a VPC and a subnet for the Opsee instance.</p>
              <Button to="/start/choose-vpc" color="success" block chevron>Choose a VPC</Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(AddInstance);

