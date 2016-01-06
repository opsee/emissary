import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {checks as actions} from '../../actions';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {List, Map} from 'immutable';
import {Toolbar} from '../global';

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
  renderInner() {
    const check = this.getCheck();
    const spec = check.get('check_spec').value;
  },
  render() {
    const check = this.getCheck();

    return (
      <div>

        <Toolbar title={check.get('name') || check.get('id')} />

        <Grid>
          <Row>
            <Col xs={12}>




              just hanging out
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
