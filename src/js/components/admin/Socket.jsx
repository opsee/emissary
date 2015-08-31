import React from 'react';
import Toolbar from '../global/Toolbar.jsx';
import GlobalActions from '../../actions/Global';
import GlobalStore from '../../stores/Global';
import Link from 'react-router/lib/components/Link';
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
           <Col xs={12} sm={10} smOffset={1}>
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