import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import Immutable, {Record, List, Map} from 'immutable';

const statics = {
  getSignupsSuccess(data){
    _signups = Immutable.fromJS(data);
  }
};

const _regions = [
  {
    id:'ap-southeast-1',
    name:'Singapore'
  },
  {
    id:'ap-southeast-2',
    name:'Sydney'
  },
  {
    id:'eu-central-1',
    name:'Frankfurt'
  },
  {
    id:'eu-west-1',
    name:'Ireland'
  },
  {
    id:'sa-east-1',
    name:'São Paolo'
  },
  {
    id:'us-east-1',
    name:'N. Viginia'
  },
  {
    id:'us-west-1',
    name:'N. California'
  },
  {
    id:'us-west-2',
    name:'Oregon'
  }
];

const Store = Flux.createStore(
  {
    getRegions(){
      return _regions;
    },
  }, function(payload){
  switch (payload.actionType) {
  }
}
);

export default Store;