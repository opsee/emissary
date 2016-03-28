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
    }),
    location: PropTypes.shape({
      pathname: PropTypes.string
    }).isRequired
  },
  getInitialState() {
    const docs = !!this.props.location.pathname.match('docs');
    return {
      docs
    };
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
          <a href={`${base}/${links[index]}`} target="_blank">View File</a>
        </Padding>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        <Toolbar title={this.state.docs ? 'Security & Permissions' : 'Security & Permissions Review'}/>
        <Grid>
          <Row>
            <Col xs={12}>
            <Padding b={2}>
              <p>Have a look at the IAM roles and permissions Opsee requires for installation. We use 2 IAM roles and 1 CloudFormation template.</p>
              <Heading level={2}>Instance IAM Role</Heading>
              <p>Used by our EC2 instance once added to your environment. It needs read permissions for AWS services to run health checks, and we ask for additional permissions to EC2 (so you can perform actions like restarts within Opsee) and auto scale groups (so that we can keep a running instance at all times)</p>
              {this.renderTemplateItem('role')}
              <Heading level={2}>Ingress IAM Role</Heading>
              <p>Used to ensure communication betweeen your security groups and the Opsee security group within your chosen VPC.</p>
              {this.renderTemplateItem('ingress')}
              <Heading level={2}>CloudFormation Template</Heading>
              <p>Used to install our EC2 instance. Notably, we create both a security group and auto scale group (to set rules requiring at least one running Opsee instance at all times), and add our instance to both groups.</p>
              {this.renderTemplateItem('cf')}
              {!this.state.docs && <p>If you have any questions, you can reach out to us any time on <Link target="_blank" to="https://app.opsee.com/help">email, Slack, or IRC</Link>.</p>}
            </Padding>
            {!this.state.docs && <Button to="/start/region-select" color="success" block chevron>Next</Button>}
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

export default connect(null, mapDispatchToProps)(Permissions);