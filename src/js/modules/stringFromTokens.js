export default function(tokens = []){
  return tokens.map(token => {
    const {tag, phrase} = token;
    const term = phrase ? `"${token.term}"` : token.term;
    return tag ? `${tag}:${term}` : term;
  }).join(' ');
}