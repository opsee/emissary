import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {BoundField} from '../forms';
import _ from 'lodash';
import {Close, ChevronRight} from '../icons';

export default React.createClass({
  render() {
    return (
     <div className="progress">
        <div className={`progress_bar ${this.props.percentage == 100 ? 'complete' : ''}`} ng-style="{ 'width' : this.getPercentComplete() + '%' }"></div>
        <div className="ticks">
          {[1,2,3,4,5,6,7].map(i => {
            return (
              <div className="tick"/>
            )
          })}
        </div>
      </div>
    );
  }
});