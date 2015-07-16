import React, {PropTypes} from 'react';

export default React.createClass({
  render(){
    return(
      <div className="hidden">
        <form ng-submit="submit()">
          <input type="text" placeholder="Search" className="form-control" ng-model="search" id="searchBoxInput" typeahead="state as state.url for state in states | filter:$viewValue" typeahead-on-select="select()"/>
          <button type="submit" className="sr-only">Submit</button>
        </form>
      </div>
    )
  }
})