import React, {PropTypes} from 'react';
import forms from 'newforms';
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
    string: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  },
  getInitialState() {
    const self = this;
    return {
      form: new SearchForm({
        onChange(){
          self.forceUpdate();
          const {form} = self.state;
          if (
            form.cleanedData.string === form.data.string ||
            //weird situation with validation not firing on rapid location change, fuuuck
            !form.cleanedData.string && form.data.string
            ){
            self.handleSearch(form.cleanedData.string);
          } else if(form.cleanedData.string && !form.data.string){
            self.handleSearch('');
          }
        },
        labelSuffix: '',
        controlled: true,
        emptyPermitted: true,
        validation: {
          on: 'blur change',
          onChangeDelay: 450
        },
        initial: {string: this.props.string || ''}
      })
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.string !== this.state.form.data.string){
      this.state.form.updateData({
        string: nextProps.string || ''
      });
    }
  },
  handleSearch(string){
    if (this.props.string !== string){
      this.props.actions.setString(string);
    }
  },
  handleSubmit(e){
    e.preventDefault();
    if (this.state.form.data.string){
      this.props.actions.setString(this.state.form.data.string);
    }
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
  location: state.router.location,
  string: state.router.location.query.s
  // query: state.router.location.query
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);