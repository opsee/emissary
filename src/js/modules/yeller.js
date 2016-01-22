import config from './config';
import _ from 'lodash';

const {Yeller} = window;

if (typeof Yeller === 'function'){
  Yeller.configure({
    token: 'yk_w_f5f4b9abeaad0266f6b0de9ca8cc756b65dc3e86312566d7398caf0fde0f577a',
    environment: config.env,
    transform(err){
      const data = err['custom-data'] || {};
      return _.assign({}, err, {
        'custom-data': _.assign({}, data, {
          userId: self.props.redux.user.get('id')
        })
      });
    }
  });
}

const yeller = {
  report(...args){
    if (typeof Yeller === 'function'){
      return Yeller.report(...args);
    }
  }
};

export default yeller;