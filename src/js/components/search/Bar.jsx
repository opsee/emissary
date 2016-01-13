import React, {PropTypes} from 'react';
import forms from 'newforms';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BoundField} from '../forms';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Search} from '../icons';
import {search as actions} from '../../actions';
import style from './bar.css';

const SearchForm = forms.Form.extend({
  string: forms.CharField({
    label: ' ',
    widgetAttrs: {
      placeholder: 'What are you looking for?',
      id: 'universal-search',
      labelInside: true
    },
    required: false
  }),
  render() {
    return (
      <BoundField bf={this.boundField('string')}>
        <label htmlFor="universal-search" className={style.iconLabel}>
          <Search className="icon"/>
        </label>
      </BoundField>
    );
  }
});

const SearchBar = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setString: PropTypes.func
    }),
    string: PropTypes.string
  },
  getInitialState() {
    const self = this;
    return {
      form: new SearchForm({
        onChange(){
          self.forceUpdate();
          if (self.state.form.cleanedData.string === self.state.form.data.string){
            self.handleSearch();
          }
        },
        labelSuffix: '',
        controlled: true,
        validation: {
          on: 'blur change',
          onChangeDelay: 300
        },
        initial: {string: this.props.string}
      })
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.string !== this.state.form.data.string){
      this.state.form.updateData({
        string: nextProps.string
      });
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextState.form.cleanedData, this.state.form.cleanedData);
  },
  handleSearch(){
    const {string} = this.state.form.cleanedData;
    if (this.props.string !== string){
      this.props.actions.setString(string);
    }
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.setString(this.state.form.cleanedData.string);
  },
  render(){
    return (
      <form name="envWithFilterForm" className={style.form} onSubmit={this.handleSubmit}>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.state.form.render()}
            </Col>
          </Row>
        </Grid>
      </form>
    );
  }
});

const mapStateToProps = (state) => ({
  string: state.search.string
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);