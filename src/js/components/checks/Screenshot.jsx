import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';

import {checks as actions} from '../../actions';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
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
    // The JSON containing check notification data to populate the screenshot is
    // uploaded to S3 by the Notificaption service (but any JSON URL would work)
    const jsonURI = this.props.location.query.json;
    this.props.actions.getCheckFromURI(jsonURI);
  },
  getNotification() {
    const notification = this.props.redux.checks.notification;
    const hasData = !!notification && !notification.isEmpty();
    return hasData ? notification : new Map({ check_id: this.props.params.id });
  },
  getFailingResponses() {
    const notification = this.getNotification();
    return notification.get('responses').filter(response => !response.passing);
  },
  isJSONLoaded() {
    // True if the JSON has been loaded from the S3 URL
    return this.getNotification().has('check_name');
  },
  renderInner() {
    if (!this.isJSONLoaded()) {
      return null;
    }
    return (
      <div className="js-screenshot-results">
        <CheckResponsePaginate responses={this.getFailingResponses().take(1)}
          allowCollapse={false} showRerunButton={false} />
      </div>
    );
  },
  render() {
    const check = this.getNotification();
    return (
      <div>
        <Toolbar title={check.get('check_name') || check.get('check_id')} />
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
