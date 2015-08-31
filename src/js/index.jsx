import React from 'react/addons';
var {CSSTransitionGroup} = React.addons;
import router from './modules/router.js';
import client from 'swagger-client';
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

// var swagger = new client({
//   url: 'http://petstore.swagger.io/v2/swagger.json',
//   success: function() {
//     swagger.pet.getPetById({petId:0},{responseContentType: 'application/json'},function(pet){
//       console.log('pet', pet);
//     });
//   }
// })