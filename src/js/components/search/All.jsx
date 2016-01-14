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
      }),
      checks: PropTypes.shape({
        checks: PropTypes.object,
        filtered: PropTypes.object
      }),
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object,
          elb: PropTypes.object
        }),
        instances: PropTypes.shape({
          ecc: PropTypes.object,
          rds: PropTypes.object
        }),
        filtered: PropTypes.shape({
          groups: PropTypes.shape({
            security: PropTypes.object,
            elb: PropTypes.object
          }),
          instances: PropTypes.shape({
            ecc: PropTypes.object,
            rds: PropTypes.object
          })
        })
      })
    })
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
          <Button flat={!this.isStateSelected('unmonitored')} onClick={this.runState.bind(null, 'unmonitored')}><Circle fill={!this.isStateSelected('unmonitored') ? 'text' : ''} inline/>Unmonitored</Button>
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
  renderLists(){
    const envArr = ['groups.security', 'groups.elb', 'instances.rds', 'instances.ecc'];
    const envSizes = envArr.map(env => {
      return _.get(this.props.redux.env.filtered, `${env}.size`) || 0;
    });
    const checksFirst = _.last(envSizes.sort()) < this.props.redux.checks.filtered.size;
    if (checksFirst){
      return (
        <div>
          <CheckItemList filter title/>
          <EnvList filter limit={this.props.redux.search.string ? 1000 : 8}/>
        </div>
      );
    }
    return (
      <div>
        <EnvList filter limit={this.props.redux.search.string ? 1000 : 8}/>
        <CheckItemList filter title/>
      </div>
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
                  {this.renderLists()}
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