import React, {PropTypes} from 'react';
import Autosuggest from 'react-autosuggest';

export default React.createClass({
  propTypes: {
    suggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired
  },
  getData(input, cb){
    let data = ['foo', 'fa', 'fee'];
    cb(null, data);
  },
  renderSuggestion(suggestion){
    return suggestion;
  },
  render(){
    return (
      <div>
        <Autosuggest {...this.props} getData={this.getData} suggestionRenderer={this.renderSuggestion}/>
      </div>
    );
  }
});