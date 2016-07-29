import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';
import TimeAgo from 'react-timeago';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {Time} from '../icons';
import {UserDataRequirement} from '../user';
import CheckItemList from './CheckItemList.jsx';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import AssertionCounter from './AssertionCounter';
import {
  checks as actions,
  user as userActions,
  app as appActions
} from '../../actions';
import {Check} from '../../modules/schemas';

const Feed = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getChecks: PropTypes.func.isRequired,
      selectToggle: PropTypes.func.isRequired,
      delSelected: PropTypes.func.isRequired
    }),
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    appActions: PropTypes.shape({
      confirmOpen: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object
      }),
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        getChecks: PropTypes.object,
        checksDelete: PropTypes.object
      })
    })
  },
  getInitialState() {
    return {
      notifEditing: false
    };
  },
  componentWillMount(){
    this.props.actions.getChecks();
  },
  getData(){
    const checks = this.props.redux.checks.checks.toJS();
    return _.chain(checks)
    .map(c => {
      return _.map(c.state_transitions || [], t => {
        return _.assign({}, t, _.pick(c, ['id', 'name']))
      });
    })
    .flatten()
    .reject(i => {
      const arr = [
        i.to.match('FAIL_WAIT|PASS_WAIT'),
        i.to === 'WARN',
        i.from === 'FAIL_WAIT' && i.to === 'OK',
        i.from === 'PASS_WAIT' && i.to === 'FAIL'
      ];
      return _.some(arr);
    })
    .sortBy(i => i.occurred_at * -1)
    .value();
  },
  getSelectedChecks(){
    return this.props.redux.checks.checks.filter(check => {
      return check.get('selected');
    });
  },
  getExtCheckUrl(){
    let check = new Check().toJS();
    let data = _.assign(check, {
      type: 'http',
      target: {
        type: 'external_host'
      }
    });
    //strip notifs and assertions because they are added later in the process
    data = _.omit(data, ['notifications', 'assertions']);
    data = window.encodeURIComponent(JSON.stringify(data));
    return `/check-create/request?data=${data}`;
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckTypeHelp');
  },
  handleNotifEdit(){
    this.setState({
      notifEditing: true
    });
  },
  handleSelectorClick(){
    this.props.actions.selectToggle();
  },
  renderChecks(){
    if (!this.props.redux.checks.checks.size) {
      //TODO - figure out why <Link> element is causing react to throw an error. Has something to do with statushandler and link.
      return (
        <StatusHandler status={this.props.redux.asyncActions.getChecks.status}>
          <Padding b={2}><Heading level={2}>Welcome to Opsee! Let&rsquo;s get started.</Heading></Padding>
          <p>Thanks for signing up! Let&rsquo;s get your environment set up:</p>

          <ol>
            <li><Link to={this.getExtCheckUrl()} title="Create New Check">Create your first health check</Link> for any public URL</li>
            <li>Keep your team in the loop by setting up <a href="/profile">Slack and Pagerduty integration</a> on your Profile page</li>
            <li>If you&rsquo;re hosted in AWS, <a href="/start/launch-stack">add our EC2 instance</a> to run checks inside your environment too</li>
          </ol>
        </StatusHandler>
      );
    }
    return (
      <div>
        <CheckItemList title selectable/>
      </div>
    );
  },
  renderItem(item, i){
    const passing = item.to === 'OK' ? true : false;
    return (
      <div key={`feed-item-${i}`} className="display-flex">
        <div>
          <AssertionCounter passing={passing} title={passing ? 'Check Passing' : 'Check Failing'}/>
        </div>
        <div>
          <Link to={`/check/${item.id}`}>{item.name || item.id}</Link><br/>
          <Time inline/>&nbsp;<TimeAgo date={item.occurred_at}/>
        </div>
      </div>
    )
  },
  renderInner(){
    const data = this.getData();
    const action = this.props.redux.asyncActions.getChecks;
    if (!action.history.length){
      return <StatusHandler status={action.status}/>
    }
    if (data.length){
      return (
        <div>
          {data.map((item, i) => this.renderItem(item, i))}
          {JSON.stringify(this.getData())}
        </div>
      )
    }
    return (
      <div>
        No events in the last 24 hours
      </div>
    )
  },
  render() {
    return (
      <div>
        <Toolbar title="Feed"/>
        <Padding b={2}>
          <Grid>
            <Row>
              <Col xs={12}>
                <Panel>
                  <BastionRequirement>
                    {this.renderInner()}
                  </BastionRequirement>
                </Panel>
              </Col>
            </Row>
          </Grid>
        </Padding>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

const mapStateToProps = (state) => ({
  redux: state,
  scheme: state.app.scheme
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);