import React, {PropTypes} from 'react';
import {Label} from '../forms';
import DropdownButton from '../../modules/bootstrap';
import {MenuItem} from '../../modules/bootstrap';
import _ from 'lodash';
import Autosuggest from 'react-autosuggest';

const SuggestionRenderer = React.createClass({
  render(){
    return(
      <div>
        foo
      </div>
    )
  }
});

export default React.createClass({
  propTypes:{
    suggestions:PropTypes.func.isRequired,
    onSuggestionSelected:PropTypes.func.isRequired
  },
  getData(input, cb){
    let data = ['foo','fa','fee']
    cb(null, data);
  },
  selectItem(choice, event){
    console.log(choice);
  },
  suggestionRenderer(suggestion, input){
    console.log(suggestion, input);
    return 'foo';
  },
  render(){
    return(
      <div>
        <Autosuggest {...this.props} suggestionRenderer={this.suggestionRenderer}/>
      </div>
    )
  }
});