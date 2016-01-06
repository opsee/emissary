import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {checks as actions} from '../../actions';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {List, Map} from 'immutable';
import {Toolbar} from '../global';
import AssertionItemList from './AssertionItemList';

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

    if (check.get('name')) {
      const spec = check.get('check_spec').value;

      return (
        <div>
          <Padding b={1}>
            <h3>Target</h3>
          </Padding>

          <Padding b={1}>
            <h3>HTTP Request</h3>
          </Padding>

          <Padding b={1}>
            <h3>Responses</h3>
          </Padding>

          <Padding b={1}>
            <h3>Assertions</h3>
            <AssertionItemList assertions={check.get('assertions')}/>
          </Padding>

          <Padding b={1}>
            <h3>Notifications</h3>
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
