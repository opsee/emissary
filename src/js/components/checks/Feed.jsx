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
  componentWillMount(){
    if (!this.props.renderAsInclude){
      this.props.actions.getChecks();
    }
  },
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
      <Padding key={`feed-item-${i}`} b={1}>
        <Row>
          <Col xs={2} sm={1}>
            <AssertionCounter passing={passing} title={passing ? 'Check Passing' : 'Check Failing'}/>
          </Col>
          <Col xs={10} sm={11}>
            {this.renderLink(item)}{!this.renderAsInclude ? 'C' : 'c'}heck began to {passing ? 'pass' : 'fail'}<br/>
            <Link to={`/check/${item.check_id}/event/${item.id}`}><Time inline fill="text"/>&nbsp;<TimeAgo date={item.occurred_at}/></Link>
          </Col>
        </Row>
      </Padding>
    )
  },
  renderList(){
    const data = this.getData();
    const action = this.props.redux.asyncActions.getChecks;
    if (!action.history.length){
      return <StatusHandler status={action.status}/>
    }
    if (data.length){
      return (
        <div>
          {data.map((item, i) => this.renderItem(item, i))}
        </div>
      )
    }
    return (
      <div>
        No events in the last 24 hours
      </div>
    )
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
  renderInner(){
    return (
      <div>
        {this.renderList()}
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