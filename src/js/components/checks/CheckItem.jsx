import React, {PropTypes} from 'react';
import {is, Map, Record} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ListItem} from '../global';
import {ListCheckmark, ListClose} from '../icons';
import {checks as actions, app as appActions} from '../../actions';

const CheckItem = React.createClass({
  propTypes: {
    item: PropTypes.oneOfType([
      PropTypes.instanceOf(Map),
      PropTypes.instanceOf(Record)
    ]).isRequired,
    onClick: PropTypes.func,
    actions: PropTypes.shape({
      del: PropTypes.func.isRequired,
      selectToggle: PropTypes.func
    }),
    appActions: PropTypes.shape({
      closeContextMenu: PropTypes.func
    }),
    selectable: PropTypes.bool
  },
  shouldComponentUpdate(nextProps) {
    return !is(this.props.item, nextProps.item);
  },
  getInfoText(item){
    if (item.total){
      const passing = item.passing;
      const failing = item.total - passing;
      return (
        <span>
          <span title={`${passing} instance${passing === 1 ? '' : 's'} passing`}>
            <ListCheckmark inline fill="textSecondary"/>{passing}
          </span>
          &nbsp;&nbsp;
          <span title={`${failing} instance${failing === 1 ? '' : 's'} failing`}>
            <ListClose inline fill="textSecondary"/>{failing}
          </span>
          &nbsp;&nbsp;
          <span>
            passing: {item.stats.passing + item.stats.warning}
          </span>
        </span>
      );
    }
    return 'Initializing';
  },
  getSelectable(){
    if (this.props.selectable){
      return {
        onSelect: this.props.actions.selectToggle.bind(null, this.props.item.get('id'))
      };
    }
    return {};
  },
  handleDeleteClick(){
    this.props.actions.del(this.props.item.get('id'));
    this.props.appActions.closeContextMenu();
  },
  render(){
    const item = this.props.item.toJS();
    if (item.name){
      return (
        <ListItem type="check" link={`/check/${this.props.item.get('id')}`} params={{name: item.name}} onClick={this.props.onClick} item={this.props.item} {...this.getSelectable()}>
          <div key="line1">{item.name}</div>
          <div key="line2">{this.getInfoText(item)}</div>
        </ListItem>
      );
    }
    return null;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(CheckItem);