import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Grid, Row, Col} from '../../modules/bootstrap';

import {Button} from '../forms';
import {BastionRequirement, Toolbar} from '../global';
import {Circle} from '../icons';
import {Padding} from '../layout';
import {search as actions} from '../../actions';
import {EnvList} from '../env';
import {CheckItemList} from '../checks';

const SearchAll = React.createClass({
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
  isStateSelected(state){
    return state === _.chain(this.props.redux.search.tokens).filter({tag: 'state'}).first().get('term').value();
  },
  runState(term){
    this.props.actions.setTokens([{tag: 'state', term}]);
  },
  renderPassingButton(){
    return (
      <Col className="col-xs">
        <Padding b={1}>
          <Button flat={!this.isStateSelected('passing')} color="success" onClick={this.runState.bind(null, 'passing')}><Circle fill={!this.isStateSelected('passing') ? 'success' : ''} inline/> Passing</Button>
        </Padding>
      </Col>
    );
  },
  renderFailingButton(){
    return (
      <Col className="col-xs">
        <Padding b={1}>
          <Button flat={!this.isStateSelected('failing')} color="danger" onClick={this.runState.bind(null, 'failing')}><Circle fill={!this.isStateSelected('failing') ? 'danger' : ''} inline/>Failing</Button>
        </Padding>
      </Col>
    );
  },
  renderUnmonitoredButton(){
    return (
      <Col className="col-xs">
        <Padding b={1}>
          <Button flat={!this.isStateSelected('running')} onClick={this.runState.bind(null, 'running')}><Circle fill={!this.isStateSelected('running') ? 'text' : ''} inline/>Unmonitored</Button>
        </Padding>
      </Col>
    );
  },
  renderFilterButtons(){
    return (
      <Padding b={1}>
        <Row>
          {this.renderFailingButton()}
          {this.renderPassingButton()}
          {this.renderUnmonitoredButton()}
        </Row>
      </Padding>
    );
  },
  render(){
    return (
      <div>
        <Toolbar title="Search"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <BastionRequirement>
                  {this.renderFilterButtons()}
                  <EnvList filter/>
                  <CheckItemList filter title/>
                </BastionRequirement>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchAll);