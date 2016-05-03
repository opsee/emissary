import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Highlight, Toolbar} from '../global';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import {Heading} from '../type';
import crossAccountImg from '../../../img/tut-cross-account.svg';
import templates from '../../modules/awsTemplates';

const LaunchStack = React.createClass({
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
  componentWillMount() {
    const item = this.props.redux.asyncActions.onboardGetTemplates;
    if (!item.status){
      this.props.actions.getTemplates();
    }
  },
  renderTemplate() {
    const data = this.props.redux.onboard.templates[2]; // FIXME
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
    }
    return (
      <Padding b={1}>
        <a href={_.get(templates, 'role')} target="_blank">View File</a>
      </Padding>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Step 1: Launch our stack"/>

        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={2}>
                <p>Opsee uses two tools to monitor your environment: cross-account access and our EC2 instance. We'll start by adding cross-account access.</p>
              </Padding>
            </Col>
          </Row>

          <Row className="middle-xs">
            <Col xs={12} sm={6} style={{textAlign: 'center'}}>
              <Padding a={2}>
                <img src={crossAccountImg} alt="Cross-account access between Opsee and your AWS environment" style={{width: '100%', maxWidth: '400px'}} />
              </Padding>
            </Col>
            <Col xs={12} sm={6}>
              <Heading level={3}>About cross-account access</Heading>
              <p>Our cross-account role lets Opsee continuously discover what's in your environment and allows our instance to run health checks. You can view and control this access at any time in <a href="https://console.aws.amazon.com/iam/home" target="_blank">your IAM console</a>.</p>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Padding tb={2}>
                <Heading level={4}>Cross-account Access CloudFormation Template</Heading>
                <p>We enable cross-account access using a CloudFormation template. You can review the template below, which sets all of the capabilities and permissions. It's also <a href="/docs/permissions" target="_blank">available in our docs</a>.</p>

                {this.renderTemplate()}
              </Padding>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <p>Next, you'll choose which region the CloudFormation stack will live in.</p>
              <Button to="/start/choose-region" color="success" block chevron>Select a region</Button>
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

export default connect(null, mapDispatchToProps)(LaunchStack);
