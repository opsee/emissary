import React from 'react';
import {BoundField} from '../forms';
import forms from 'newforms';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {PageAuth} from '../../modules/statics';
import EnvWithFilter from './EnvWithFilter.jsx';

const FilterForm = forms.Form.extend({
  filter: forms.CharField({
    label: 'Filter',
    widgetAttrs: {
      placeholder: 'group: target-group'
    },
    required: false
  }),
  render() {
    return <BoundField bf={this.boundField('filter')}/>;
  }
});

export default React.createClass({
  statics: {
    willTransitionTo: PageAuth
  },
  getInitialState(){
    return {
      filter: new FilterForm({
        onChange: self.forceUpdate,
        labelSuffix: ''
      })
    };
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvWithFilter/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});
