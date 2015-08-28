import React from 'react/addons';
var {CSSTransitionGroup} = React.addons;
import Router from 'react-router';
import router from '../router.jsx';
import Header from './global/Header.jsx';
import MessageModal from './global/MessageModal.jsx';
import Actions from '../actions/Global';
const RouteHandler = Router.RouteHandler;
import DocumentTitle from 'react-document-title';

export default React.createClass({
  render() {
    console.log(this.props);
    return (
      <div>
        <DocumentTitle title="Opsee"/>
        <Header/>
        <div style={{position:'relative'}}>
          <CSSTransitionGroup component="div" transitionName="page">
            <RouteHandler {...this.props} key={this.props.pathname}/>
          </CSSTransitionGroup>
        </div>
        {
        // <RouteHandler/>
        }
        <MessageModal/>
      </div>
    );
  }
});