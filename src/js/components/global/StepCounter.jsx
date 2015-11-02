import React, {PropTypes} from 'react';
import _ from 'lodash';

const StepCounter = React.createClass({
  propTypes: {
    steps: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired
  },
  getDefaultProps(){
    return {
      steps: 3,
      active: 1
    };
  },
  render(){
    return (
      <div className="step-counter">
        {_.range(this.props.steps).map((n, i) => {
          return <div className={`step-bullet${this.props.active === i + 1 ? ' active' : ''}`} key={`step-counter-${i}`}/>;
        })}
      </div>
    );
  }
});

export default StepCounter;