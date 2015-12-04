import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler} from '../global';
import {Alert} from '../../modules/bootstrap';
import CheckItem from './CheckItem.jsx';
import {SetInterval} from '../../modules/mixins';
import {checks as actions} from '../../reduxactions';

const CheckItemList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    type: PropTypes.string,
    target: PropTypes.string,
    actions: PropTypes.shape({
      getChecks: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object
      }),
      asyncActions: PropTypes.shape({
        getChecks: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.actions.getChecks();
    this.setInterval(this.props.actions.getChecks, 15000);
  },
  shouldComponentUpdate() {
    // return !Immutable.is(this.state.checks, nextState.checks) || nextState.status !== this.state.status;
    return true;
  },
  getChecks(){
    let data = this.props.redux.checks.checks;
    if (this.props.target){
      data = data.filter(c => {
        return c.get('target').id === this.props.target;
      });
    }
    return data;
  },
  render() {
    if (this.getChecks().size){
      return (
        <div>
          {this.getChecks().map(c => {
            return <CheckItem item={c} key={c.get('id')}/>;
          })}
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getChecks.status}>
        <Alert bsStyle="default">No checks applied</Alert>
      </StatusHandler>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckItemList);