import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Highlight, Toolbar} from '../global';
import {Expandable, Padding, Grid, Row, Col} from '../layout';
import {Heading} from '../type';
import ec2InstaceImage from '../../../img/tut-ec2-instance.svg';

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
        templates: PropTypes.array
      })
    }),
    actions: PropTypes.shape({
      getTemplates: PropTypes.func
    })
  },
  componentWillMount(){
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
          <p><small className="text-muted">Last modified: {data.headers['last-modified']}</small></p>
          <Expandable style={{background: seed.color.gray9}}>
            <Highlight style={{padding: '1rem'}}>
              {data.text}
            </Highlight>
          </Expandable>
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
        <Toolbar title="Step 2: Add our EC2 Instance"/>

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
              <p>The instance is a t2.micro and is free-tier eligible. It's responsible for running checks,
              and it inherits all of its permissions from the cross-account role you set up in the last step.
              The instance is controlled by both a CloudFormation template and an Ingress IAM Role,
              which are both available in are documentation.</p>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Padding tb={2}>
                <Heading level={4}>Instance CloudFormation Template</Heading>
                <p>Used to install our EC2 instance. Notably, we create a security group and
                auto-scale group (to set rules requiring at least one running Opsee instance
                at all times), and add our instance to both groups.</p>

                <Padding t={1}>
                  {this.renderTemplateItem('cf')}
                </Padding>
              </Padding>

              <Padding tb={2}>
                <Heading level={4}>Ingress IAM Role</Heading>
                <p>Used to ensure communication between your security groups and the Opsee security group
                within your chosen VPC.</p>

                <Padding t={1}>
                  {this.renderTemplateItem('ingress')}
                </Padding>
              </Padding>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div>
                <Button to={`/s/choose-vpc?region=${this.props.location.query.region}`} color="success" block>Choose a VPC</Button>
                <p className="text-center"><small className="text-muted">Questions? Reach out to us any time on email, Slack, or IRC.</small></p>
              </div>
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

