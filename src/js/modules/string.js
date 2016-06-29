import _ from 'lodash';
import toSentenceSerial from 'underscore.string/toSentenceSerial';

function stringFromTokens(tokens = []) {
  return tokens.map(token => {
    const {tag, phrase} = token;
    const term = phrase ? `"${token.term}"` : token.term;
    return tag && term ? `${tag}:${term}` : term;
  }).join(' ');
}

function permsSentence(member) {
  let arr = _.chain(member).get('perms').pickBy(p => p).keys().map(c => {
    let str = c;
    switch (str){
    case 'edit':
      str = 'Check Management';
      break;
    case 'admin':
      str = 'Team Admin';
      break;
    default:
      break;
    }
    return _.chain(str).split(' ').map(_.capitalize).join(' ').value();
  }).value();
  // arr.push('Check Management');
  if (member.status === 'inactive'){
    return 'All user functions are disabled.';
  } else if (arr.length){
    return toSentenceSerial(_.uniq(arr));
  }
  return 'Check viewing';
}

export {
  permsSentence,
  stringFromTokens,
  toSentenceSerial
};