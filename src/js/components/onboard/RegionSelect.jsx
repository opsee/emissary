import React, {PropTypes} from 'react';
import {History} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Toolbar} from '../global';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {onboard as actions} from '../../actions';
import config from '../../modules/config';
import regions from '../../modules/regions';
import {RadioSelect} from '../forms';

const RegionSelect = React.createClass({
  mixins: [History],
  propTypes: {
    actions: PropTypes.shape({
      setRegion: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      onboard: PropTypes.shape({
        regionLaunchURL: PropTypes.string
      })
    })
  },
  componentWillReceiveProps(nextProps) {
    const thisURL = _.get(this.props.redux, 'onboard.regionLaunchURL');
    const nextURL = _.get(nextProps.redux, 'onboard.regionLaunchURL');

    if (this.state.region && thisURL !== nextURL) {
      const formattedURL = _.replace(nextURL, '${region}', this.state.region);
      window.open(this.history.createHref(formattedURL));
      this.history.pushState(null, `/s/add-instance?region=${this.state.region}`);
    }
  },
  getInitialState() {
    return {
      region: null
    };
  },
  handleSelect(region){
    this.setState({ region });
    this.props.actions.makeLaunchRoleUrlTemplate();
  },
  renderRegions(){
/*                  <form onSubmit={this.handleSubmit}>
          <Heading level={3}>Choose a region to launch your stack</Heading>

           <RadioSelect onChange={this.handleSelect} data={this.state} options={this.getRegions()} path="region"/>
            <Padding t={1}>
              <Button color="success" block type="submit" disabled={!this.state.region} title={!this.state.region ? 'Choose a region to move on.' : 'Next'} chevron>Next</Button>
            </Padding>
          </form>*/
    return regions.map((region, i) => {
      let boundClick = this.handleSelect.bind(null, _.get(region, 'id'));
      return (
        <div key={i}>
          <div>{_.get(region, 'id')}</div>
          <div>{_.get(region, 'name')} <Button onClick={boundClick} flat secondary>Launch stack</Button></div>
        </div>
      );
    });
  },
  renderInner(){

    if (!_.find(this.props.redux.env.bastions, 'connected')){
      return (
        <div>
          <p>It's time to launch our CloudFormation stack. Choose a region by clicking one of the buttons below.
          When you're finished, come back to Opsee to continue installation.</p>

          <Heading level={2}>What to do in the AWS Console</Heading>
          <p>Here's the TLDR version of what to do in your AWS console:</p>
          <p><strong>Click Next 3 times, then check the "acknowledge" box, and click Create.</strong></p>
          <p>See all the details in our install documentation. If you have any trouble here, reach out to us any time at support@opsee.com.</p>

          {this.renderRegions()}
        </div>
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

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RegionSelect);