import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {checks as actions} from '../../actions';
import Checkmark from '../svgs/Checkmark';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import style from './onboard.css';

const PostInstall = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      checks: PropTypes.object
    }),
    actions: PropTypes.shape({
      getChecks: PropTypes.func
    })
  },
  componentWillMount(){
    this.props.actions.getChecks();
  },
  getAutogeneratedCheckCount(){
    return this.props.redux.checks.checks.filter(check => {
      return _.endsWith(check.name, '(auto)');
    }).size;
  },
  renderCheckCount(){
    if (this.props.redux.checks.checks.isEmpty()) {
      return null;
    }
    return (
      <div>
        <h2>{this.getAutogeneratedCheckCount()}</h2>
        <h3 style={{fontWeight: 300}}>health checks</h3>
        <p>were created for you!</p>
      </div>
    );
  },
  render(){
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={4} lr={2} style={{margin: '0 auto'}}>
                <Checkmark />
              </Padding>
              <div className="text-center">
                <h2>You're all done!</h2>
                <p>The Opsee instance was successfully installed.</p>
              </div>
              <Padding tb={3} className="text-center">
                {this.renderCheckCount()}
              </Padding>
              <Padding t={1} b={2}>
                <Button to="/" color="success" block chevron>Check them out</Button>
              </Padding>
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

export default connect(mapStateToProps, mapDispatchToProps)(PostInstall);