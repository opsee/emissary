import React from 'react';
import {Toolbar} from '../global';
import {GlobalStore} from '../../stores';
import {Link} from 'react-router';
import Router from 'react-router';
const RouteHandler = Router.RouteHandler;
import _ from 'lodash';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  mixins: [GlobalStore.mixin],
  storeDidChange() {
    const messages = GlobalStore.getSocketMessages();
    if(messages.length != this.state.messages.length){
      this.setState({messages});
    }
  },
  getInitialState(){
    return {
      messages:[]
    }
  },
  render() {
    return (
      <div>
       <Toolbar title="Socket Messages"/>
       <Grid>
         <Row>
           <Col xs={12} display-flex>
               {this.state.messages.map((m, i) => {
                  return (
                    <div key={i}>
                      <pre>{JSON.stringify(m, null, ' ')}</pre>
                    </div>
                  )
               })}
             </Col>
           </Row>
         </Grid>
      </div>
    );
  }
});