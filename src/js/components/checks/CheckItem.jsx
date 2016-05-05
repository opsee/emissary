import React, {PropTypes} from 'react';
import {is, Record} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ContextMenu, ListItem} from '../global';
import {Edit, Delete, ListCheckmark, ListClose} from '../icons';
import {Button} from '../forms';
import {checks as actions, app as appActions} from '../../actions';

const CheckItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
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
  getInfoText(){
    if (this.props.item.get('total')){
      const passing = this.props.item.get('passing');
      const failing = this.props.item.get('total') - passing;
      return (
        <span>
          <span title={`${passing} instance${passing === 1 ? '' : 's'} passing`}>
            <ListCheckmark inline fill="textSecondary"/>{passing}
          </span>
          &nbsp;&nbsp;
          <span title={`${failing} instance${failing === 1 ? '' : 's'} failing`}>
            <ListClose inline fill="textSecondary"/>{failing}
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
    if (this.props.item.get('name')){
      return (
        <ListItem type="check" link={`/check/${this.props.item.get('id')}`} params={{name: this.props.item.get('name')}} onClick={this.props.onClick} item={this.props.item} {...this.getSelectable()}>
          <ContextMenu title={`${this.props.item.get('name')} Actions`} id={this.props.item.get('id')} key="menu">
            <Button text="left" color="primary" block flat to={`/check/edit/${this.props.item.get('id')}`}>
              <Edit inline fill="primary"/> Edit
            </Button>
            <Button text="left" color="danger" block flat onClick={this.handleDeleteClick}>
              <Delete inline fill="danger"/> Delete
            </Button>
          </ContextMenu>
          <div key="line1">{this.props.item.get('name')}</div>
          <div key="line2">{this.getInfoText()}</div>
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