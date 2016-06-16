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
  const arr = member.perms.map(c => {
    let str = c;
    switch (str){
    case 'editing':
      str = 'Check Editing';
      break;
    case 'management':
      str = 'User Management';
      break;
    default:
      break;
    }
    return _.chain(str).split(' ').map(_.capitalize).join(' ').value();
  });
  return toSentenceSerial(arr);
}

export {
  permsSentence,
  stringFromTokens,
  toSentenceSerial
};