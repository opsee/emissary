import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';
import TimeAgo from 'react-timeago';
import moment from 'moment';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {Time} from '../icons';
import {UserDataRequirement} from '../user';
import CheckItemList from './CheckItemList.jsx';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Panel, Row} from '../layout';
import {Color, Heading} from '../type';
import AssertionCounter from './AssertionCounter';
import {config} from '../../modules';
import {
  checks as actions,
  user as userActions,
  app as appActions
} from '../../actions';
import {Check} from '../../modules/schemas';

const Feed = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getChecks: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object
      }),
      asyncActions: PropTypes.shape({
        getChecks: PropTypes.object
      })
    }),
    id: PropTypes.string
  },
  getDefaultProps() {
    return {
      renderAsInclude: false
    };
  },
  getInitialState() {
    return {
      hours: config.checkActivityStartHours
    };
  },
  getNewHours(h = this.props.redux.checks.startHours){
    if (h < 72){
      return 96;
    }
    if (h < 150){
      return 168;
    }
    if (h < 300){
      return 336;
    }
    if (h < 700){
      return 744;
    }
    return 1200;
  },
  // componentWillMount(){
  //   if (!this.props.renderAsInclude){
  //     this.props.actions.getChecks();
  //   }
  // },
  getFormatted(){
    let checks = this.props.redux.checks.checks.toJS();
    if (this.props.id){
      checks = _.filter(checks, c => c.id === this.props.id);
    }
    return _.chain(checks)
    .map(c => {
      let trans = _.chain(c.state_transitions || [])
      .sortBy(i => i.occurred_at * -1)
      .map(t => {
        return _.assign({}, t, {
          check_id: c.id,
          name: c.name
        });
      })
      .value();
      return trans.map((item, i) => {
        const next = trans[i + 1];
        if (next){
          return _.assign(item, {
            select: next.to !== 'WARN'
          });
        }
        return item;
      });
    })
    .flatten()
    .sortBy(i => i.occurred_at * -1)
    .value();
  },
  getData(){
    return _.chain(this.getFormatted())
    .filter({select: true})
    .filter(i => {
      const arr = [
        i.to === 'FAIL' && i.from !== 'PASS_WAIT',
        i.to === 'OK' && i.from !== 'FAIL_WAIT'
      ];
      return _.some(arr);
    })
    .value();
  },
  handleMoreClick(){
    const hours = this.getNewHours();
    this.props.actions.getChecks({
      hours
    });
  },
  renderLink(item){
    if (!this.props.renderAsInclude){
      return (
        <Link to={`/check/${item.check_id}`}><span style={{fontWeight: '500'}}>{item.name || item.id}&nbsp;</span></Link>
      );
    }
    return null;
  },
  renderItem(item, i){
    const passing = item.to === 'OK' ? true : false;
    return (
      <Padding key={`feed-item-${i}`} b={2}>
        <Row>
          <Col xs={2} sm={1}>
            <AssertionCounter passing={passing} title={passing ? 'Check Passing' : 'Check Failing'}/>
          </Col>
          <Col xs={10} sm={11}>
            {this.renderLink(item)}{this.props.renderAsInclude ? 'C' : 'c'}heck began to {passing ? 'pass' : 'fail'}&nbsp;<Link to={`/check/${item.check_id}/event/${item.id}`}><TimeAgo date={item.occurred_at}/></Link><br/>
            <Link to={`/check/${item.check_id}/event/${item.id}`}>
              <Time inline fill="text"/>&nbsp;&nbsp;<small><Color c="muted" scheme={this.props.scheme}>{new Date(item.occurred_at).toString()}</Color></small>
            </Link>
          </Col>
        </Row>
      </Padding>
    )
  },
  renderEndOfList(){
    const ago = moment().subtract({hours: this.props.redux.checks.startHours}).fromNow();
    let str = `End of events from ${ago}`;
    if (this.props.redux.asyncActions.getChecks.status === 'pending'){
      str = 'Loading more events...';
    }
    return (
      <Padding t={2}>
        <Alert>{str}</Alert>
      </Padding>
    );
  },
  renderList(){
    const data = this.getData();
    const action = this.props.redux.asyncActions.getChecks;
    // if (!action.history.length){
    //   return <StatusHandler status={action.status}/>
    // }
    if (data.length){
      return (
        <div>
          {data.map((item, i) => this.renderItem(item, i))}
        </div>
      )
    }
    return null;
  },
  renderDebugData(){
    if (process.env.NODE_ENV === 'debug'){
      return (
        <Padding t={3}>
          {JSON.stringify(this.getFormatted())}
        </Padding>
      );
    }
    return null;
  },
  renderMoreButton(){
    if (this.props.redux.checks.startHours < 1200){
      return (
        <Padding t={2}>
          <Button onClick={this.handleMoreClick} flat color="primary" disabled={this.props.redux.asyncActions.getChecks.status === 'pending'}>View More Events</Button>
        </Padding>
      );
    }
  },
  renderInner(){
    return (
      <div>
        {this.renderList()}
        <StatusHandler status={this.props.redux.asyncActions.getChecks.status} timeout={0} persistent/>
        {this.renderEndOfList()}
        {this.renderMoreButton()}
        {
          // this.renderDebugData()
        }
      </div>
    )
  },
  render() {
    if (this.props.renderAsInclude){
      return this.renderInner();
    }
    return (
      <div>
        <Toolbar title="Check Events"/>
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