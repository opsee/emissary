import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {Edit, Delete} from '../icons';
import {Button} from '../forms';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import ViewHTTP from './ViewHTTP';
import ViewCloudwatch from './ViewCloudwatch';
import {Check} from '../../modules/schemas';
import {SetInterval} from '../../modules/mixins';

import {
  checks as actions,
  app as appActions
} from '../../actions';

const CheckSingle = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getCheck: PropTypes.func.isRequired,
      del: PropTypes.func.isRequired
    }),
    appActions: PropTypes.shape({
      confirmOpen: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      checks: PropTypes.object,
      asyncActions: PropTypes.shape({
        getCheck: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.actions.getCheck(this.props.params.id);
    this.setInterval(() => {
      this.props.actions.getCheck(this.props.params.id);
    }, 60000);
  },
  getCheck(){
    const {single} = this.props.redux.checks;
    if (single.get('id') === this.props.params.id){
      return single;
    }
    return new Check({id: this.props.params.id});
  },
  runRemoveCheck(){
    this.props.appActions.confirmOpen({
      html: `<p>Are you sure you want to delete <br/><strong>${this.getCheck().get('name')}?</strong></p>`,
      confirmText: 'Yes, delete',
      color: 'danger',
      onConfirm: this.props.actions.del.bind(null, [this.props.params.id], true)
    });
  },
  renderView(check){
    if (check.get('tags').find(() => 'complete')){
      const isCloudwatch = _.chain(check.toJS()).get('assertions').head().get('key').value() === 'cloudwatch';
      return isCloudwatch ? <ViewCloudwatch check={check}/> : <ViewHTTP check={check} redux={this.props.redux}/>;
    } else if (this.props.redux.asyncActions.getCheck.status === 'pending'){
      return <StatusHandler status={this.props.redux.asyncActions.getCheck.status}/>;
    }
    return null;
  },
  renderAdvancedOptions(check){
    if (check.get('min_failing_time') !== 90 || check.get('min_failing_count') !== 1){
      return (
        <div>
          <Heading level={3}>Advanced Check Options</Heading>
          <strong>Minimum Failing Time</strong>: {check.min_failing_time}s<br/>
          <strong>Minimum Failing Count</strong>: {check.min_failing_count}
        </div>
      );
    }
    return null;
  },
  renderLink(check){
    if (check && check.get('id')){
      return (
        <Button to={`/check/edit/${this.props.params.id}`} color="info" fab title={`Edit ${check.get('name')}`}>
          <Edit btn/>
        </Button>
      );
    }
    return null;
  },
  renderInner(check){
    const {status} = this.props.redux.asyncActions.getCheck;
    if (status && typeof status !== 'string'){
      return <StatusHandler status={status}/>;
    }
    return (
      <div>
        <Padding tb={2}>
          {this.renderView(check)}
        </Padding>
        {this.renderAdvancedOptions(check)}
        <Padding t={3}>
          <Button onClick={this.runRemoveCheck} flat color="danger">
            <Delete inline fill="danger"/> Delete Check
          </Button>
        </Padding>
      </div>
    );
  },
  render() {
    const check = this.getCheck();
    return (
      <div>
        <Toolbar title={check.get('name') || 'Check'}>
          {this.renderLink(check)}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                <BastionRequirement>
                  {this.renderInner(check)}
                </BastionRequirement>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(CheckSingle);