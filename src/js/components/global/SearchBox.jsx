import React, {PropTypes} from 'react';

export default React.createClass({
  render(){
    return(
      <div class="ng-hide" ng-show="visible">
        <form ng-submit="submit()">
          <input type="text" placeholder="Search" class="form-control" ng-model="search" id="searchBoxInput" typeahead="state as state.url for state in states | filter:$viewValue" typeahead-on-select="select()"/>
          <button type="submit" class="sr-only">Submit</button>
        </form>
      </div>
    )
  }
})