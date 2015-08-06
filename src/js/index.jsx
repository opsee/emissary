import React from 'react';
import router from './router.jsx';
import client from 'swagger-client';

router.run((Root, state) => {  
    React.render(
        <Root params={state.params}/>,
        document.getElementById('main')
    );
});

var swagger = new client({
  url: 'http://petstore.swagger.io/v2/swagger.json',
  success: function() {
    swagger.pet.getPetById({petId:0},{responseContentType: 'application/json'},function(pet){
      console.log('pet', pet);
    });
  }
})