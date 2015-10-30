import React, {PropTypes} from 'react';
import _ from 'lodash';
import colors from 'seedling/colors';

export default React.createClass({
  propTypes: {
    percentage: PropTypes.number.isRequired,
    steps: PropTypes.number
  },
  getDefaultProps(){
    return {
      steps: 7
    };
  },
  getBg(){
    if (this.props.percentage >= 100){
      return colors.success;
    }else if (this.props.percentage === 0){
      return colors.warning;
    }else if (this.props.percentage === -1){
      return colors.danger;
    }
    return colors.primary;
  },
  getWidth(){
    if (this.props.percentage === 0 || this.props.percentage === -1){
      return '100%';
    }
    return `${this.props.percentage}%`;
  },
  render() {
    return (
     <div className="progress">
        <div className="progress_bar" style={{width: this.getWidth(), background: this.getBg()}}></div>
        <div className="ticks">
          {_.range(this.props.steps - 1).map(i => {
            return (
              <div className="tick" style={{margin: `0 ${100 / this.props.steps / 2}%`}} key={`progress-bar-${i}`}/>
            );
          })}
        </div>
      </div>
    );
  }
});