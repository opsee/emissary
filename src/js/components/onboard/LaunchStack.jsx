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
    console.log(this.props.redux.onboard.templates);
    const data = this.props.redux.onboard.templates[2];
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
              <p>Opsee uses two tools to monitor your environment: cross-account access and our EC2 instance. We'll start by adding cross-account access.</p>

              <Padding>
                <img src={crossAccountImg} alt="Cross-account access between Opsee and your AWS environment" />
              </Padding>

              <Heading level={3}>About cross-account access</Heading>
              <p>Our cross-account role lets Opsee continuously discover what's in your environment and allows our instance to run health checks. You can view and control this access at any time in your IAM console.</p>

              <Heading level={4}>Cross-account Access CloudFormation Template</Heading>
              <p>We enable cross-account access using a CloudFormation template. You can review the template below, which sets all of the capabilities and permissions. It's also available in our docs.</p>

              {this.renderTemplate()}

              <p>Next, you'll choose where to launch our CloudFormation stack.</p>
              <Button to="/s/region" color="success" block>Select a region</Button>
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
