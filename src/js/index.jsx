import React from 'react';
import router from './router.jsx';

router.run((Root, state) => {  
    React.render(
        <Root params={state.params}/>,
        document.body
    );
});