import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {PageAuth} from '../../modules/statics';
import EnvWithFilter from './EnvWithFilter.jsx';
import {State} from 'react-router';
import _ from 'lodash';

export default React.createClass({
  mixins: [State],
  statics: {
    willTransitionTo: PageAuth
  },
  propTypes: {
    query: PropTypes.object
  },
  getInitialState(){
    const path = this.getPath();
    let include = ['groupsSecurity', 'groupsELB', 'instancesECC'];
    if (path){
      if (path.match('groups-security')){
        include = ['groupsSecurity'];
      }else if (path.match('groups-elb')){
        include = ['groupsELB'];
      }else if (path.match('instances-ec2')){
        include = ['instancesECC'];
      }
    }
    return {
      include
    };
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvWithFilter include={this.state.include} filter={_.get(this.props.query, 'filter')} limit={this.state.include.length === 1 ? 1000 : null}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});
