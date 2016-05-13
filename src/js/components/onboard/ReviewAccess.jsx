/* eslint-disable */
import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {History} from 'react-router';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Highlight} from '../global';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import crossAccountImg from '../../../img/tut-cross-account.svg';
import templates from '../../modules/awsTemplates';
import style from './onboard.css';

const LaunchStack = React.createClass({
  mixins: [History],
  propTypes: {
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        onboardGetTemplates: PropTypes.object,
        onboardHasRole: PropTypes.object
      }),
      onboard: PropTypes.shape({
        hasRole: PropTypes.bool,
        templates: PropTypes.array
      })
    }),
    actions: PropTypes.shape({
      hasRole: PropTypes.func,
      getTemplates: PropTypes.func
    })
  },
  getInitialState(){
    return {
      showTemplate: false
    };
  },
  componentWillMount() {
    const item = this.props.redux.asyncActions.onboardGetTemplates;
    if (!item.status){
      this.props.actions.getTemplates();
    }
    this.props.actions.hasRole();
  },
  // componentWillReceiveProps(nextProps){
  //   if (nextProps.redux.onboard.hasRole) {
  //     this.history.pushState(null, '/start/launch-instance');
  //   }
  // },
  renderTemplate() {
    const data = this.props.redux.onboard.templates[2]; // FIXME
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
        <Padding tb={1}>
          <h2>Opsee Cross-Account Access</h2>
        </Padding>
        <p>Our cross-account role lets Opsee continuously discover what's in your environment and allows our instance to run health checks. You can view and control this access at any time in <a href="https://console.aws.amazon.com/iam/home" target="_blank">your IAM console</a>.</p>
        <p>We enable cross-account access using a CloudFormation template. You can review the template below, which sets all of the capabilities and permissions. It's also <a href="/docs/permissions" target="_blank">available in our docs</a>.</p>
        <p>We should add an annotated version of this like <a href="https://cloudnative.io/yeobot/cloudformation/" target="_blank">https://cloudnative.io/yeobot/cloudformation/</a>.</p>
        {this.renderTemplate()}
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

export default connect(mapStateToProps, mapDispatchToProps)(LaunchStack);
