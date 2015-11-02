import React from 'react/addons';
import router from './modules/router.js';
import _ from 'lodash';
import {hideNavList} from './components/global/Routes.jsx';
import {GlobalActions} from './actions';

window._ = _;

router.run((Root, state) => {
  const testRoutes = state.routes;
  const names = _.pluck(testRoutes, 'name');
  const bool = !(_.intersection(names, hideNavList).length);
  GlobalActions.globalSetNav(bool);
  React.render(
      (
        <div>
          <Root params={state.params} {...state}>
          {
            // <CSSTransitionGroup transitionName="example">
            //   {React.cloneElement(this.props.children || <div/>, {key: 'foo'})}
            // </CSSTransitionGroup>
          }
          </Root>
        </div>
      ),
      document.getElementById('main')
  );
});