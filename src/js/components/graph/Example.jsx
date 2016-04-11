import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {env as actions} from '../../actions';


const GraphExample = React.createClass({

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col>
              <h1>graph example</h1>
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
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphExample);