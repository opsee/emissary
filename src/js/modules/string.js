import toSentenceSerial from 'underscore.string/toSentenceSerial';

function stringFromTokens(tokens = []) {
  return tokens.map(token => {
    const {tag, phrase} = token;
    const term = phrase ? `"${token.term}"` : token.term;
    return tag && term ? `${tag}:${term}` : term;
  }).join(' ');
}

export {
  stringFromTokens,
  toSentenceSerial
};