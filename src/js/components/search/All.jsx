import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Grid, Row, Col} from '../../modules/bootstrap';

import {BastionRequirement, Toolbar} from '../global';
import {search as actions} from '../../actions';
import {EnvList} from '../env';
import {CheckItemList} from '../checks';
import FilterButtons from './FilterButtons';

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
          <hr/>
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
                  <FilterButtons/>
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