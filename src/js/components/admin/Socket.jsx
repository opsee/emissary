import React from 'react';
import Toolbar from '../global/Toolbar.jsx';
import GlobalActions from '../../actions/Global';
import GlobalStore from '../../stores/Global';
import Link from 'react-router/lib/components/Link';
import Router from 'react-router';
const RouteHandler = Router.RouteHandler;
import _ from 'lodash';

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
       <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
               {this.state.messages.map((m, i) => {
                  return (
                    <div key={i}>
                      <pre>{JSON.stringify(m, null, ' ')}</pre>
                    </div>
                  )
               })}
             </div>
           </div>
         </div>
      </div>
    );
  }
});