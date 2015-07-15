import React, {PropTypes} from 'react';
import Router from 'react-router';
const Route = Router.Route;
import Opsee from './components/Opsee.jsx';
import Home from './components/pages/Home.jsx';
import Styleguide from './components/pages/Styleguide.jsx';

const RouteHandler = Router.RouteHandler;

const routes = (
  <Route handler={Opsee}>
    <Route path="styleguide" handler={Styleguide}/>
    <Route path="/" handler={Home}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root/>, document.body);
});

export default React.createClass({
  render(){
    return(
      <div>
        Hello app
      </div>
    )
  }
});