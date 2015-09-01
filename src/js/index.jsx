import React from 'react/addons';
var {CSSTransitionGroup} = React.addons;
import router from './modules/router.js';
import _ from 'lodash';

window._ = _;

router.run((Root, state) => {  
  React.render(
      (
        <div>
          <Root params={state.params} {...state}>
          {
            // <CSSTransitionGroup transitionName="example">
            //   {React.cloneElement(this.props.children || <div/>, {key:'foo'})}
            // </CSSTransitionGroup>
          }
          </Root>
        </div>
      ),
      document.getElementById('main')
  );
});