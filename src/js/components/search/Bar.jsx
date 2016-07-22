import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cx from 'classnames';
import _ from 'lodash';

import {Col, Grid, Row} from '../layout';
import {Search} from '../icons';
import {search as actions} from '../../actions';
import style from './bar.css';
import {Input} from '../forms';

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
    id: PropTypes.string,
    scheme: PropTypes.string,
    useScheme: PropTypes.bool,
    standalone: PropTypes.bool
  },
  getDefaultProps() {
    return {
      useScheme: false
    };
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
  renderInput(){
    return (
      <Input className={cx(style.searchInput, this.props.useScheme && style[this.props.scheme])} placeholder="Search" onChange={this.handleSearch} data={this.state} path="string" id="universal-search" onFocus={this.handleFocus} onBlur={this.handleFocus.bind(null, false)} scheme={this.props.useScheme && this.props.scheme || undefined}>
        <Search className={cx('icon', style.mag, style[this.props.scheme])} fill="white"/>
      </Input>
    );
  },
  renderInner(){
    if (this.props.standalone){
      return this.renderInput();
    }
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            {this.renderInput()}
          </Col>
        </Row>
      </Grid>
    );
  },
  render(){
    return (
      <label htmlFor="universal-search" className={cx(style.label, {[style.labelFocused]: this.state.focused}, style[this.props.scheme])}>
        {this.renderInner()}
      </label>
    );
  }
});

const mapStateToProps = (state) => ({
  location: state.router.location,
  string: state.search.string,
  scheme: state.app.scheme
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);