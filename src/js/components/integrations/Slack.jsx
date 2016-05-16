import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler, Toolbar} from '../global';
import {Alert, Col, Grid, Row} from '../layout';
import {integrations as actions} from '../../actions';

const Slack = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      slackAccess: PropTypes.func
    })
  },
  componentWillMount(){
    const {query} = this.props.location;
    if (query.code){
      this.props.actions.slackAccess(query.code);
    }
  },
  renderInner(){
    const {query} = this.props.location;
    if (query.code){
      return (
        <StatusHandler status={this.props.redux.asyncActions.integrationsSlackAccess.status} waitingText="Finishing up authorization...">
          Successful connection to Slack. Thanks!
        </StatusHandler>
      );
    }
    return (
      <Alert color="danger">
        Whoops, something must have gone wrong.
      </Alert>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Connect to Slack"/>
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

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Slack);