import React, {PropTypes} from 'react';
import cx from 'classnames';
import {connect} from 'react-redux';

import style from './loader.css';

const Loader = React.createClass({
  propTypes: {
    //wait X number of seconds until showing the loader
    timeout: PropTypes.number,
    className: PropTypes.string,
    scheme: PropTypes.string
  },
  getInitialState(){
    return {
      show: false
    };
  },
  componentDidMount(){
    const self = this;
    setTimeout(() => {
      if (self.isMounted()){
        self.setState({
          show: true
        });
      }
    }, self.props.timeout || 700);
  },
  render(){
    if (this.state.show){
      return (
        <div className={cx('display-flex', 'justify-content-center', this.props.className)}>
          <div className={cx(style.loader, style[this.props.scheme])}></div>
        </div>
      );
    }
    return null;
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Loader);