import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';
import {Link} from 'react-router';

import {Highlight, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Expandable, Padding} from '../layout';
import {Heading} from '../type';
import {onboard as actions} from '../../actions';

const Templates = React.createClass({
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
  renderTemplates(){
    const {templates} = this.props.redux.onboard;
    const get = this.props.redux.asyncActions.onboardGetTemplates;
    if (get.status === 'success' && templates.length){
      return ['Ingress IAM Role', 'CloudFormation Template', 'Instance IAM Role'].map((title, index) => {
        const data = templates[index];
        return (
          <Padding b={2} key={`template-${index}`}>
            <Heading level={2}>{title}</Heading>
            <Heading level={4}>Last modified: {data.headers['last-modified']}</Heading>
            <Expandable style={{background: seed.color.gray9}}>
              <Highlight style={{padding: '1rem'}}>
                {JSON.stringify(data.body, null, ' ')}
              </Highlight>
            </Expandable>
          </Padding>
        );
      });
    } else if (typeof get.status === 'object'){
      return (
        <Padding b={2}>
          Please refer to <Link target="_blank" to="/help">our docs</Link> for information about our cloudformation, iam role, and ingress role templates.
        </Padding>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        <Toolbar title="Security & Permissions Review"/>
        <Grid>
          <Row>
            <Col xs={12}>
            <Padding b={2}>
              <p>Have a look at the IAM roles and permissions Opsee requires for installation. We use 2 IAM roles and 1 CloudFormation template.</p>
              <ul>
                <li><strong>Instance IAM Role:</strong> used by our EC2 instance once added to your environment. It needs read permissions for AWS services to run health checks, and we ask for additional permissions to EC2 (so you can perform actions like restarts within Opsee) and auto scale groups (so that we can keep a running instance at all times)</li>
                <li><strong>Ingress IAM Role:</strong> used to ensure communication betweeen your security groups and the Opsee security group within your chosen VPC.</li>
                <li><strong>CloudFormation Template:</strong> used to install our EC2 instance. Notably, we create both a security group and auto scale group (to set rules requiring at least one running Opsee instance at all times), and add our instance to both groups. </li>
              </ul>
              <p>If you have any questions, you can reach out to us any time on <a target="blank" href="https://app.opsee.com/help">email, Slack, or IRC</a>.</p>
            </Padding>
            {this.renderTemplates()}
            <Button to="/start/credentials" color="success" block chevron>Next</Button>
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

export default connect(null, mapDispatchToProps)(Templates);