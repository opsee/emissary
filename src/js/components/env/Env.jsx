import React, {PropTypes} from 'react';
import {BoundField, Button} from '../forms';
import forms from 'newforms';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {RadialGraph} from '../global';
import {HomeStore} from '../../stores';
import {Toolbar} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import GroupItem from '../groups/GroupItem.jsx';
import {RouteHandler} from 'react-router';
import {Link} from 'react-router';
import {InstanceActions, GlobalActions} from '../../actions';
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
    return <BoundField bf={this.boundField('filter')}/>
  }
});

export default React.createClass({
  statics: {
    willTransitionTo: PageAuth
  },
  getInitialState(){
    return {
      filter: new FilterForm({
        onChange: self.filterHasChanged,
        labelSuffix: ''
      })
    }
  },
  filterHasChanged(){
    this.forceUpdate();
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
