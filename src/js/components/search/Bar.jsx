import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cx from 'classnames';
import _ from 'lodash';

import {Col, Grid, Row} from '../layout';
import {Search} from '../icons';
import {search as actions} from '../../actions';
import style from './bar.css';
import {Input} from '../forms2';

const SearchBar = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setString: PropTypes.func
    }),
    string: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
    noRedirect: PropTypes.bool,
    id: PropTypes.string
  },
  getInitialState() {
    return {
      debouncedSearch: _.debounce(this.props.actions.setString, 400),
      string: this.props.string,
      focused: false
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.string !== this.state.string){
      this.setState({
        string: nextProps.string
      });
    }
  },
  componentWillUnmount() {
    this.props.actions.setString('', true);
  },
  handleSearch(state){
    this.setState(state);
    this.state.debouncedSearch(state.string, this.props.noRedirect);
  },
  handleFocus(focused = true){
    this.setState({
      focused: !!focused
    });
  },
  render(){
    return (
      <label htmlFor="universal-search" className={cx(style.label, {[style.labelFocused]: this.state.focused})}>
        <Grid>
          <Row>
            <Col xs={12}>
                <Input placeholder="What are you looking for?" onChange={this.handleSearch} data={this.state} path="string" id="universal-search" onFocus={this.handleFocus} onBlur={this.handleFocus.bind(null, false)}>
                  <Search className="icon"/>
                </Input>
            </Col>
          </Row>
        </Grid>
      </label>
    );
  }
});

const mapStateToProps = (state) => ({
  location: state.router.location,
  string: state.search.string
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);