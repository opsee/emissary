import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';
import {Link} from 'react-router';
import cx from 'classnames';

import {Close} from '../icons';
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
      }),
      app: PropTypes.shape({
        scheme: PropTypes.string
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
    // FIXME use import
    const arr = ['ingress', 'cf', 'role'];
    const base = 'https://s3.amazonaws.com/opsee-bastion-cf-us-east-1/beta';
    const links = ['bastion-ingress-cf.template', 'bastion-cf.template', 'opsee-role-stack.json'];
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
      <div className={cx(style.transitionPanel, style[this.props.redux.app.scheme])}>
        <Link to="/start/launch-instance" className={style.closeWrapper}>
          <Close className={style.closeButton} />
        </Link>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={2}>
                <h2>About the Opsee EC2 instance</h2>
              </Padding>
              <p>The Opsee EC2 instance is <a href="https://aws.amazon.com/ec2/instance-types/" target="_blank">a t2.micro and is free-tier eligible</a>. It&rsquo;s responsible for running checks, and it has no IAM permissions of its own. The instance is launched via CloudFormation. There are two CloudFormation stacks associated with it. The first is "The Opsee Stack", and the second is the "listing of bastion security-group ingress rules." This second stack ensures that our instance can communicate with services you have running in your VPC. Both CloudFormation templates are available <a href="/docs/permissions" target="_blank">in our documentation</a>.</p>

              <Padding tb={1}>
                <h4>Instance CloudFormation Template</h4>
                <p>Used to install our EC2 instance. Notably, we create a security group and auto-scale group (to set rules requiring at least one running Opsee instance at all times), and add our instance to both groups.</p>
                {this.renderTemplateItem('cf')}
              </Padding>
              <Padding b={1}>
                <h4>Instance Ingress Stack</h4>
                <p>Used to ensure communication between your security groups and the Opsee security group within your chosen VPC.</p>
                {this.renderTemplateItem('ingress')}
              </Padding>
              <p>If you&rsquo;d like to know more, reach out to us any time on <a href="mailto:support@opsee.co">email</a>, <a href="https://opsee-support.slack.com" target="_blank">Slack</a>, or <a href="irc://irc.freenode.org/opsee" target="_blank">IRC</a>.</p>
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