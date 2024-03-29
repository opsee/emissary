import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';
import {Link} from 'react-router';

import {Highlight, Toolbar} from '../global';
import {Col, Expandable, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import {onboard as actions} from '../../actions';
import awsTemplates from '../../modules/awsTemplates';

const Permissions = React.createClass({
  propTypes: {
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
    const index = arr.indexOf(title);
    const data = this.props.redux.onboard.templates[index];

    if (data){
      return (
        <Padding b={2}>
          <Heading level={4}>Last modified: {data.headers['last-modified']}</Heading>
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
          <a href={_.get(awsTemplates, title)} target="_blank">View File</a>
        </Padding>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        <Toolbar title="Docs: Security & Permissions"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                <Padding b={2}>
                  <p>A complete installation of Opsee consists of 3 CloudFormation stacks, 1 stack for our cross-account IAM role, 1 stack for our EC2 instance, and 1 stack for security group ingress rules for our instance. The cross-account IAM role stack is the only one you&rsquo;ll need to install manually.</p>
                  <Heading level={2}>Template for Cross-Account Access</Heading>
                  <p>Used by our backend once added to your environment. It needs read permissions for AWS services to run health checks, and we ask for additional permissions to EC2 (so you can perform actions like restarts within Opsee) and auto scale groups (so that we can keep a running instance at all times)</p>
                  {this.renderTemplateItem('role')}
                  <Heading level={2}>Template for Security Group Ingress </Heading>
                  <p>Used to ensure communication betweeen your security groups and the Opsee security group within your chosen VPC.</p>
                  {this.renderTemplateItem('ingress')}
                  <Heading level={2}>Template for EC2 Instance</Heading>
                  <p>Used to install our EC2 instance. Notably, we create both a security group and auto scale group (to set rules requiring at least one running Opsee instance at all times), and add our instance to both groups.</p>
                  {this.renderTemplateItem('cf')}
                  <p>If you have any questions, you can reach out to us any time on <Link target="_blank" to="https://app.opsee.com/help">email, Slack, or IRC</Link>.</p>
                </Padding>
              </Panel>
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

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);