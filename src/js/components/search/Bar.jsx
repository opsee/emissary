import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import colors from 'seedling/colors';
import {BoundField} from '../forms';

import {Person, Checkmark, Help, Cloud, Login} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Search, Circle} from '../icons';

const SearchForm = forms.Form.extend({
  search: forms.CharField({
    label: 'Search',
    widgetAttrs: {
      placeholder: 'What are you looking for?',
      noLabel: true
    },
    required: false
  }),
  render() {
    return (
      <Padding b={1}>
        <BoundField bf={this.boundField('search')}>
          <Search className="icon"/>
        </BoundField>
      </Padding>
    );
  }
});

const Header = React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired,
    hide: PropTypes.bool
  },
  getInitialState() {
    const self = this;
    const obj = {
      search: new SearchForm(_.assign({
        onChange: self.onFilterChange,
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 50
        }
      }, this.getFilter() ? {data: {filter: this.getFilter()}} : null)),
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    if (this.getFilter()){
      setTimeout(() => {
        this.state.filter.setData({filter: this.getFilter()});
      }, 50);
    }
    return _.extend(obj, {
      cleanedData: null
    });
  },
  render(){
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <form name="envWithFilterForm">
              {this.state.search.render()}
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default Header;