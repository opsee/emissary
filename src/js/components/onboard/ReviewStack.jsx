import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';
import {Link} from 'react-router';

import { Close } from '../icons';
import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Highlight} from '../global';
import Instructions from './LaunchStackInstructions';
import {Expandable, Padding} from '../layout';
import templates from '../../modules/awsTemplates';
import style from './onboard.css';

const LaunchStack = React.createClass({
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
  renderHowTo(){
    return (
      <div>
        <Padding tb={1}>
          <h3>How to install the CloudFormation Stack</h3>
        </Padding>
        <p>We enable cross-account access using a CloudFormation stack. To launch
        the stack in your AWS environment, do the following in your AWS console:</p>
        <Padding tb={1}>
          <ol>
            <li>Click "Next" on the "Select Template" screen. The template URL will already be specified for you.</li>
            <li>Click "Next" on the "Specify Details" page.</li>
            <li>Click "Next" on the "Options" page.</li>
            <li>Click the check box at the bottom of the “Review” page to acknowledge the notice about IAM privileges, and click “Create” to launch the stack.</li>
          </ol>
        </Padding>
        <p>You can monitor the progress of the role creation in your AWS console. It can take a couple of minutes. When it&rsquo;s done, return to this screen to finish installation.</p>
      </div>
    );
  },
  render() {
    return (
      <div className={style.transitionPanel}>
        <Link to="/start/launch-stack" className={style.closeWrapper}>
          <Close className={style.closeButton} />
        </Link>
        <Padding tb={1}>
          <h2>Opsee Cross-Account Access</h2>
        </Padding>
        <p>Our cross-account role lets Opsee continuously discover what&rsquo;s in your environment, lets us monitor metrics in CloudWatch, and lets us manage your Opsee instance on your behalf. You can view and control this access at any time in your <a href="https://console.aws.amazon.com/iam/home" target="_blank">IAM console</a>.</p>
        <Padding tb={1}>
          <Instructions />
        </Padding>
        <Padding tb={1}>
          <Padding tb={1}>
            <h3>Our CloudFormation template</h3>
          </Padding>
          <p>We enable cross-account access using a CloudFormation template. You can review the template below, which sets all of the capabilities and permissions. It&rsquo;s also available in <a href="/docs/permissions" target="_blank">our docs</a>.</p>
          {this.renderTemplate()}
        </Padding>
        <Padding t={1} b={2}>
          <Button to="/start/launch-stack" color="primary" block>Got it</Button>
        </Padding>
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
