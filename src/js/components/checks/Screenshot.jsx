import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {checks as actions} from '../../actions';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Map} from 'immutable';
import {Toolbar} from '../global';
import AssertionItemList from './AssertionItemList';
import NotificationItemList from './NotificationItemList';
import HttpRequestItem from './HttpRequestItem';
import CheckResponsePaginate from './CheckResponsePaginate';

const CheckScreenshot = React.createClass({

  propTypes: {
    params: PropTypes.object,
    actions: PropTypes.shape({
      getCheckFromNotificaption: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      checks: PropTypes.object
    })
  },
  componentWillMount() {
    this.props.actions.getCheckFromNotificaption(this.props.params.id);
  },
  getCheck() {
    const check = this.props.redux.checks.checks.first();
    return check || new Map({id: this.props.params.id});
  },
  getFailingResponses() {
    const check = this.getCheck();
    const responses = check.get('results').first().get('responses');

    return responses.filter(response => !response.passing);
  },
  renderInner() {
    const check = this.getCheck();

    if (check.get('name')) {
      const spec = check.get('check_spec').value;
      const target = check.get('target');

      return (
        <div>
          <Padding b={1}>
            <h3>Target</h3>
            <div>{target.name || target.id}</div>
          </Padding>

          <Padding b={1}>
            <h3>HTTP Request</h3>
            <HttpRequestItem spec={spec} target={target} />
          </Padding>

          <Padding b={1}>
            <CheckResponsePaginate responses={this.getFailingResponses().take(1)}
              allowCollapse={false} />
          </Padding>

          <Padding b={1}>
            <h3>Assertions</h3>
            <AssertionItemList assertions={check.get('assertions')}/>
          </Padding>

          <Padding b={1}>
            <h3>Notifications</h3>
            <NotificationItemList notifications={check.get('notifications')} />
          </Padding>
        </div>
      );
    }

    return null;
  },
  render() {
    const check = this.getCheck();

    return (
      <div>

        <Toolbar title={check.get('name') || check.get('id')} />

        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
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

export default connect(null, mapDispatchToProps)(CheckScreenshot);
