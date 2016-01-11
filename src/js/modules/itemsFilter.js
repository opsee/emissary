import {List} from 'immutable';
import fuzzy from 'fuzzy';
import _ from 'lodash';

export default function(items = new List(), search = {string: '', tokens: []}){
  let newItems = items;
  const {tokens} = search;
  if (tokens.length){
    //do fuzzy searching first
    const stringQuery = _.chain(tokens).reject('tag').pluck('term').join(' ').value();
    newItems = newItems.filter(item => {
      if (item.get){
        const fields = [item.get('name'), item.get('id')];
        return fuzzy.filter(stringQuery, fields).length;
      }
    });
    //now let's run through the tags
    if (_.filter(tokens, 'tag').length){
      newItems = newItems.filter(item => {
        if (item.get){
          let isMatching = false;
          tokens.forEach(token => {
            let {tag = '', term} = token;
            switch (term){
            case 'true':
              term = true;
              break;
            case 'false':
              term = false;
              break;
            default:
              break;
            }
            if (tag.match('passing|failing')){
              isMatching = item.get('state') === tag;
            }
            if (item.get(tag) === term){
              isMatching = true;
            }
          });
          return isMatching;
        }
      });
    }
  }
  return newItems;
}