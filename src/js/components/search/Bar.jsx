import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import forms from 'newforms';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BoundField} from '../forms';
import {Person, Checkmark, Help, Cloud, Login} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Search, Circle} from '../icons';
import {Padding} from '../layout';
import {search as actions} from '../../actions';
import style from './bar.css';

const SearchForm = forms.Form.extend({
  search: forms.CharField({
    label: 'Search',
    widgetAttrs: {
      placeholder: 'What are you looking for?',
      noLabel: true,
      id: 'universal-search'
    },
    required: false
  }),
  constructor(data, kwargs){
    forms.Form.call(this, kwargs);
  },
  render() {
    return (
      <BoundField bf={this.boundField('search')}>
        <Search className="icon"/>
      </BoundField>
    );
  },
});

const SearchBar = React.createClass({
  getInitialState() {
    const self = this;
    const obj = {
      search: new SearchForm({search: this.props.redux.search.string}, _.assign({
        onChange: self.handleSearch,
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 250
        },
        initial: {
          search: this.props.redux.search.string
        }
      })),
    };
    return _.extend(obj, {
      cleanedData: null
    });
  },
  handleSearch(){
    this.props.actions.set(this.state.search.cleanedData.search);
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.set(this.state.search.cleanedData.search);
  },
  render(){
    return (
      <form name="envWithFilterForm" className={style.form} onSubmit={this.handleSubmit}>
        <label htmlFor="universal-search" className={style.label}>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.state.search.render()}
              </Col>
            </Row>
          </Grid>
        </label>
      </form>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);