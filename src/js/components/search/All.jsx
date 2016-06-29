import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Col, Grid, Row} from '../layout';

import {BastionRequirement, Toolbar} from '../global';
import {search as actions} from '../../actions';
import {EnvList} from '../env';
import FilterButtons from './FilterButtons';

const SearchAll = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setTokens: PropTypes.func,
      setString: PropTypes.func
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
  componentWillMount(){
    const {props} = this;
    if (props.redux.search.string !== props.location.query.s && props.location.query.s){
      props.actions.setString(props.location.query.s);
    }
  },
  componentWillUnmount() {
    this.props.actions.setString('');
  },
  renderList(){
    if (!!this.props.redux.env.activeBastion){
      return <CheckItemList limit={this.props.redux.search.string ? 1000 : 8} filter/>;
    }
    return <EnvList filter limit={this.props.redux.search.string ? 1000 : 8}/>;
  },
  render(){
    const str = this.props.location.query.s;
    return (
      <div>
        <Toolbar title={str && `Search: ${str}` || 'Search'}/>
          <Grid>
            <Row>
              <Col xs={12}>
                <FilterButtons/>
                {this.renderList()}
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