import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';

import {checks as actions} from '../../actions';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Heading} from '../type';
import {Toolbar} from '../global';
import AssertionItemList from './AssertionItemList';
import NotificationItemList from './NotificationItemList';
import HttpRequestItem from './HttpRequestItem';
import CheckResponsePaginate from './CheckResponsePaginate';

/*eslint-disable no-unused-vars*/
import style from './screenshot.css';
/*eslint-enable no-unused-vars*/

const CheckScreenshot = React.createClass({

  propTypes: {
    params: PropTypes.object,
    location: PropTypes.shape({
      query: PropTypes.shape({
        json: PropTypes.string.isRequired
      })
    }),
    actions: PropTypes.shape({
      getCheckFromURI: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      checks: PropTypes.object
    })
  },
  componentWillMount() {
    // The JSON containing check data to populate the screenshot is uploaded
    // to S3 by the Notificaption service (but any JSON URL would work)
    const jsonURI = this.props.location.query.json;
    this.props.actions.getCheckFromURI(jsonURI);
  },
  getCheck() {
    const checks = this.props.redux.checks.checks;
    return checks.size ? checks.first() : new Map({id: this.props.params.id});
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
        <div className="js-screenshot-results">
          <Padding b={1}>
            <Heading level={3}>HTTP Request</Heading>
            <HttpRequestItem spec={spec} target={target} />
          </Padding>

          <Padding b={1}>
            <Heading level={3}>Assertions</Heading>
            <AssertionItemList assertions={check.get('assertions')}/>
          </Padding>

          <Padding b={1}>
            <CheckResponsePaginate responses={this.getFailingResponses().take(1)}
              allowCollapse={false} />
          </Padding>

          <Padding b={1}>
            <Heading level={3}>Notifications</Heading>
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
