import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import config from '../../modules/config';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {user as actions} from '../../reduxactions';

const UserDataRequirement = React.createClass({
  mixins: [UserStore.mixin],
  propTypes: {
    hideIf: PropTypes.string,
    showIf: PropTypes.string,
    currentRevision: PropTypes.bool,
    children: PropTypes.node,
    actions: PropTypes.shape({
      getData: PropTypes.func
    }),
    data: PropTypes.object
  },
  componentWillMount(){
    this.props.actions.getData();
  },
  getBool(){
    if (!this.props.data){
      return false;
    }
    const property = this.props.hideIf || this.props.showIf;
    let selection = this.props.data[property];
    if (this.props.currentRevision && Array.isArray(selection)){
      selection = _.filter(selection, {revision: config.revision}).length;
    }
    if (this.props.hideIf){
      return !(selection);
    }else if (this.props.showIf){
      return !!(selection);
    }
  },
  render() {
    if (this.getBool()){
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
    return <div/>;
  }
});

const mapStateToProps = (state) => ({
  data: state.user.get('data')
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDataRequirement);