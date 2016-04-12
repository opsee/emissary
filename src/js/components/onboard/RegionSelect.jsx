import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Toolbar} from '../global';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {onboard as actions} from '../../actions';
import config from '../../modules/config';
import regions from '../../modules/regions';
import {RadioSelect} from '../forms2';

const RegionSelect = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setRegion: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      onboard: PropTypes.shape({
        region: PropTypes.string
      })
    })
  },
  getInitialState() {
    return {
      region: config.defaultBastionRegion
    };
  },
  getRegions(){
    return regions.map(r => {
      return _.assign(r, {
        label: `${r.id} - ${r.name}`
      });
    });
  },
  handleSelect(state){
    this.setState(state);
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.setRegion(this.state.region);
  },
  renderInner(){
    if (!_.find(this.props.redux.env.bastions, 'connected')){
      return (
        <form onSubmit={this.handleSubmit}>
         <p>Choose the region where you want to launch the Opsee EC2 instance. The instance will only be able to run health checks within this region.</p>
         <RadioSelect onChange={this.handleSelect} data={this.state} options={this.getRegions()} path="region"/>
          <Padding t={1}>
            <Button color="success" block type="submit" disabled={!this.state.region} title={!this.state.region ? 'Choose a region to move on.' : 'Next'} chevron>Next</Button>
          </Padding>
        </form>
      );
    }
    return (
      <Padding tb={1}>
        <Alert color="info">
          It looks like you already have an instance in your environment. At this time, Opsee only supports one instance per customer. If you need more, <a href="mailto:support@opsee.co">contact us</a>.
        </Alert>
      </Padding>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Choose a Region"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(RegionSelect);