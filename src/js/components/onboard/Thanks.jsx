import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  propTypes: {
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired
  },
  renderInner(){
    if (this.props.location.query.referrer === 'producthunt'){
      return (
        <p>Check your email to continue creating your account.</p>
      );
    }
    return (
      <div>
        <p>Thanks for letting us know you're interested in Opsee! We're currently reviewing signups for our private beta, and if you're a good fit you'll get an email from us.</p>
        <p>Til then, check out the <a href="http://twitter.com/opseeco" target="_blank">@opseeco on Twitter</a> for updates.</p>
      </div>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Thanks for Signing Up!"/>
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
