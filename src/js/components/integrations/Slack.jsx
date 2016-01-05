import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
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
    console.log(this.props.location.query);
    const {query} = this.props.location;
    if (query.code){
      this.props.actions.slackAccess(query.code);
    }
  },
  render() {
    return (
      <div>
        <Toolbar title="Connect to Slack"/>
        <Grid>
          <Row>
            <Col xs={12}>
              Ya
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