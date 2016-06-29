import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Button} from '../forms';
import {Circle} from '../icons';
import {Col, Padding, Row} from '../layout';
import {search as actions} from '../../actions';

const SearchFilterButtons = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setTokens: PropTypes.func
    }),
    redux: PropTypes.shape({
      search: PropTypes.shape({
        string: PropTypes.string,
        tokens: PropTypes.array
      })
    })
  },
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps.redux.search.tokens, this.props.redux.search.tokens);
  },
  isStateSelected(state){
    const {tokens} = this.props.redux.search;
    return _.filter(tokens, {tag: 'state', term: state}).length;
  },
  runState(term){
    const remove = this.isStateSelected(term);
    this.props.actions.setTokens([{tag: 'state', term, remove}]);
  },
  renderPassingButton(){
    return (
      <Col className="col-xs">
        <Padding b={1}>
          <Button flat={!this.isStateSelected('passing')} color="success" onClick={this.runState.bind(null, 'passing')}>
            <Circle fill={!this.isStateSelected('passing') ? 'success' : 'gray1'} inline/>&nbsp;Passing
          </Button>
        </Padding>
      </Col>
    );
  },
  renderFailingButton(){
    return (
      <Col className="col-xs">
        <Padding b={1}>
          <Button flat={!this.isStateSelected('failing')} color="danger" onClick={this.runState.bind(null, 'failing')}>
            <Circle fill={!this.isStateSelected('failing') ? 'danger' : 'gray1'} inline/>&nbsp;Failing
          </Button>
        </Padding>
      </Col>
    );
  },
  renderUnmonitoredButton(){
    return (
      <Col className="col-xs">
        <Padding b={1}>
          <Button flat={!this.isStateSelected('unmonitored')} onClick={this.runState.bind(null, 'unmonitored')}>
            <Circle fill={!this.isStateSelected('unmonitored') ? 'text' : 'gray1'} inline/>&nbsp;Unmonitored
          </Button>
        </Padding>
      </Col>
    );
  },
  render(){
    return (
      <Padding b={2}>
        <Row>
          {this.renderFailingButton()}
          {this.renderPassingButton()}
          {this.renderUnmonitoredButton()}
        </Row>
      </Padding>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state,
  scheme: state.app.scheme
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilterButtons);