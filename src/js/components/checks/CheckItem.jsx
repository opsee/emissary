import React, {PropTypes} from 'react';
import Immutable, {Record} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ListItem} from '../global';
import {Edit, Delete, ListCheckmark, ListClose} from '../icons';
import {Button} from '../forms';
import {checks as actions, app as appActions} from '../../actions';

const CheckItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    onClick: PropTypes.func,
    actions: PropTypes.shape({
      del: PropTypes.func.isRequired
    }),
    appActions: PropTypes.shape({
      closeContextMenu: PropTypes.func
    })
  },
  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.item, nextProps.item);
  },
  getInfoText(){
    if (this.props.item.get('total')){
      return (
        <span>
          <ListCheckmark inline fill="textSecondary"/>{this.props.item.get('passing')}
          &nbsp;&nbsp;
          <ListClose inline fill="textSecondary"/>{this.props.item.get('total') - this.props.item.get('passing')}
        </span>
      );
    }
    return 'Initializing';
  },
  handleDeleteClick(e){
    e.preventDefault();
    this.props.actions.del(this.props.item.get('id'));
    this.props.appActions.closeContextMenu();
  },
  render(){
    if (this.props.item.get('name')){
      return (
        <ListItem type="Check" link={`/check/${this.props.item.get('id')}`} params={{name: this.props.item.get('name')}} onClick={this.props.onClick} item={this.props.item}>
          <div key="menu">
            <Button text="left" color="primary" block flat to={`/check/edit/${this.props.item.get('id')}`}>
              <Edit inline fill="primary"/> Edit
            </Button>
            <Button text="left" color="danger" block flat onClick={this.handleDeleteClick}>
              <Delete inline fill="danger"/> Delete
            </Button>
          </div>
          <div key="line1">{this.props.item.get('name')}</div>
          <div key="line2">{this.getInfoText()}</div>
        </ListItem>
      );
    }
    return <div/>;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(CheckItem);