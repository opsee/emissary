import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import InstanceItem from './InstanceItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {List} from 'immutable';
import {Padding} from '../layout';
import {Link} from 'react-router';
import {StatusHandler} from '../global';
import {env as actions} from '../../reduxactions';

const InstanceItemList = React.createClass({
  propTypes: {
    instances: PropTypes.instanceOf(List),
    offset: PropTypes.number,
    limit: PropTypes.number,
    ids: PropTypes.array,
    noFallback: PropTypes.bool,
    actions: PropTypes.shape({
      getInstancesEcc: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        instances: PropTypes.shape({
          ecc: PropTypes.object
        })
      })
    }).isRequired
  },
  componentWillMount(){
    if (!this.props.instances){
      this.props.actions.getInstancesEcc();
    }
  },
  getInitialState(){
    return {
      offset: this.props.offset || 0,
      limit: this.props.limit || 8
    };
  },
  getInstances(noFilter){
    let data = this.props.instances ? this.props.instances : this.props.redux.env.instances.ecc;
    if (noFilter){
      return data;
    }
    if (this.props.ids){
      data = data.filter(d => {
        return this.props.ids.indexOf(d.id) > -1;
      });
    }
    data = data.sortBy(item => {
      return typeof item.get('health') === 'number' ? item.get('health') : 101;
    });
    return data.slice(this.state.offset, this.state.limit);
  },
  getMore(){
    this.setState({
      limit: 1000
    });
  },
  renderLink(){
    if (this.props.instances && this.state.limit < this.getInstances(true).size){
      return (
        <Padding t={1}>
          <Link to="/env-instances-ec2">
            Show {this.getInstances(true).size - this.state.limit} more
          </Link>
        </Padding>
      );
    }
    return <span/>;
  },
  render(){
    if (this.getInstances().size){
      return (
        <div>
          {this.getInstances().map(instance => {
            return <InstanceItem item={instance} key={instance.get('id')} {...this.props}/>;
          })}
          {this.renderLink()}
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getInstancesEcc.status} noFallback={this.props.noFallback}>
        <Alert bsStyle="default">No instances found</Alert>
      </StatusHandler>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(InstanceItemList);