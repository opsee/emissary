import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {Add} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import CheckItemList from './CheckItemList.jsx';
import {Button} from '../forms';
import {checks as actions} from '../../reduxactions';

const CheckList = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getChecks: PropTypes.func.isRequired
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
        checkDelete: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.actions.getChecks();
  },
  componentWillUpdate(nextProps) {
    const oldStatus = this.props.redux.asyncActions.checkDelete.status;
    const newStatus = nextProps.redux.asyncActions.checkDelete.status;
    if (oldStatus !== newStatus && newStatus === 'success'){
      this.props.actions.getChecks();
    }
  },
  renderChecks(){
    if (this.props.redux.checks.checks.size){
      return (
        <div>
          <h3>All Checks ({this.props.redux.checks.checks.size})</h3>
          <CheckItemList/>
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getChecks.status}>
        <p>You don&rsquo;t have any Checks yet. <Link to="/check-create" title="Create New Check">Create Your First Check</Link> to get started with Opsee.</p>

        <p>Try creating a check like this to start:</p>
        <ol>
          <li>Target a Group or Instance running a <strong>HTTP service</strong></li>
          <li>Make a request to the URL and port running that service (e.g. <strong>"/healthcheck"</strong> on <strong>Port 80</strong>)</li>
          <li>Assert that the <strong>Status Code</strong> must come back <strong>Equal to 200</strong></li>
          <li>Send <strong>notifications to your email</strong> when the Check fails</li>
        </ol>
      </StatusHandler>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Checks">
          <Button color="primary" fab to="/check-create" title="Create New Check">
            <Add btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement>
                {this.renderChecks()}
              </BastionRequirement>
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

export default connect(null, mapDispatchToProps)(CheckList);