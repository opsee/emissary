import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import forms from 'newforms';
import fuzzy from 'fuzzy';
import {List} from 'immutable';

import analytics from '../../modules/analytics';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {SetInterval} from '../../modules/mixins';

import {BoundField, Button} from '../forms';
import {BastionRequirement, StatusHandler, Toolbar} from '../global';
import {Search, Circle} from '../icons';
import {GroupItemList} from '../groups';
import {InstanceItemList} from '../instances';
import {Padding} from '../layout';
import {search as actions} from '../../actions';
import {EnvList} from '../env';
import {CheckItemList} from '../checks';

const SearchAll = React.createClass({
  componentWillMount(){
    this.props.actions.set(this.props.location.query.s);
  },
  getSearchOptions(){
    return this.props.redux.search.options;
  },
  renderPassingButton(){
    return <Button>Passing</Button>;
    if (this.getNumberPassing() > 0){
      return (
        <Col className="col-xs">
          <Padding b={1}>
            <Button flat={this.state.buttonSelected !== 'passing'} color="success" onClick={this.runToggleButtonState.bind(null, 'passing')}><Circle fill={this.state.buttonSelected !== 'passing' ? 'success' : ''} inline/> Passing</Button>
          </Padding>
        </Col>
      );
    }
    return <Col/>;
  },
  renderFailingButton(){
    return <Button>Failing</Button>;
    if (this.getNumberFailing() > 0){
      return (
        <Col className="col-xs">
          <Padding b={1}>
            <Button flat={this.state.buttonSelected !== 'failing'} color="danger" onClick={this.runToggleButtonState.bind(null, 'failing')}><Circle fill={this.state.buttonSelected !== 'failing' ? 'danger' : ''} inline/> {this.getNumberFailing()} Failing</Button>
          </Padding>
        </Col>
      );
    }
    return <Col/>;
  },
  renderUnmonitoredButton(){
    return <Button>Unmonitored</Button>;
    if (this.getNumberUnmonitored() > 0){
      return (
        <Col className="col-xs">
          <Padding b={1}>
            <Button flat={this.state.buttonSelected !== 'running'} onClick={this.runToggleButtonState.bind(null, 'running')}><Circle fill={this.state.buttonSelected !== 'running' ? 'text' : ''} inline/> {this.getNumberUnmonitored()} Unmonitored</Button>
          </Padding>
        </Col>
      );
    }
    return <Col/>;
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
    const {string} = this.props.redux.search;
    return (
      <div>
        <Toolbar title="Search"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <BastionRequirement>
                  {this.renderFilterButtons()}
                  <EnvList filter={string}/>
                  <CheckItemList filter={string} title/>
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