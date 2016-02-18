import React, {PropTypes} from 'react';

import {Padding} from '../layout';
import {Heading} from '../type';
import {Highlight} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';

const CheckDebug = React.createClass({
  propTypes: {
    check: PropTypes.object.isRequired
  },
  render(){
    if (process.env.NODE_ENV === 'debug'){
      return (
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding t={3}>
                <Heading level={2}>Check object debug</Heading>
                <Highlight>
                  {JSON.stringify(this.props.check, null, ' ')}
                </Highlight>
              </Padding>
            </Col>
          </Row>
        </Grid>
      );
    }
    return <div/>;
  }
});

export default CheckDebug;