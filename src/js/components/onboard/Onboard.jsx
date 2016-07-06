import _ from 'lodash';
import cx from 'classnames';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Circle} from '../icons';
import {Grid, Row, Col, Padding, Panel} from '../layout';
import {app as actions} from '../../actions';
import style from './onboard.css';

const Onboard = React.createClass({
  propTypes: {
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
    history: PropTypes.shape({
      pushState: PropTypes.func
    }),
    actions: PropTypes.shape({
      confirmOpen: PropTypes.func
    }),
    children: PropTypes.node,
    scheme: PropTypes.string
  },
  getInitialState(){
    return {
      numPips: 4
    };
  },
  getActivePip(){
    switch (this.props.location.pathname) {
    case '/start/launch-stack':
      return 0;
    case '/start/launch-instance':
    case '/start/install':
    case '/start/install-example':
      return 1;
    case '/start/notifications':
      return 2;
    case '/start/postinstall':
      return 3;
    default:
      return -1;
    }
  },
  renderPips(){
    const activePip = this.getActivePip();
    if (activePip < 0) {
      return null;
    }
    return _.times(this.state.numPips, i => {
      const className = cx(style.pip, {[style.activePip]: i === activePip}, style[this.props.scheme]);
      return (
        <Circle key={i} className={className} />
      );
    });
  },
  render(){
    return (
      <div className={cx(style.container, style[this.props.scheme])}>
        <Padding className={cx(style.pips, style[this.props.scheme])}>
          {this.renderPips()}
        </Padding>
        <Padding t={1}>
          <Grid>
            <Row>
              <Col xs={12}>
                <Panel>
                  {this.props.children}
                </Panel>
              </Col>
            </Row>
          </Grid>
        </Padding>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Onboard);