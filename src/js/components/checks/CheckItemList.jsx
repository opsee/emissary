import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {List} from 'immutable';
import cx from 'classnames';

import {StatusHandler} from '../global';
import {Alert} from '../layout';
import CheckItem from './CheckItem.jsx';
import {SetInterval} from '../../modules/mixins';
import {checks as actions} from '../../actions';
import {Heading} from '../type';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {flag} from '../../modules';

const CheckItemList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    type: PropTypes.string,
    target: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    //only show items that match global search tokens
    filter: PropTypes.bool,
    //only show items that are selected
    selected: PropTypes.bool,
    //allow items to be selected
    selectable: PropTypes.bool,
    //should we grab notifications from the db?
    notifications: PropTypes.bool,
    title: PropTypes.bool,
    offset: PropTypes.number,
    limit: PropTypes.number,
    noFallback: PropTypes.bool,
    //do not poll for updates
    noFetch: PropTypes.bool,
    actions: PropTypes.shape({
      getChecks: PropTypes.func.isRequired,
      selectToggle: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object,
        filtered: PropTypes.object
      }),
      search: PropTypes.shape({
        string: PropTypes.string
      }),
      asyncActions: PropTypes.shape({
        getChecks: PropTypes.object,
        checksDelete: PropTypes.object
      }),
      env: PropTypes.shape({
        activeBastion: PropTypes.object
      })
    })
  },
  getDefaultProps() {
    return {
      limit: 1000,
      offset: 0,
      noFetch: false
    };
  },
  componentWillMount(){
    if (!this.props.redux.asyncActions.getChecks.history.length){
      this.props.actions.getChecks();
    }
    if (!this.props.noFetch){
      this.setInterval(this.props.actions.getChecks, 40000);
    }
  },
  getSelectedChecks(){
    return this.props.redux.checks.checks.filter(check => {
      return check.get('selected');
    });
  },
  getChecks(noFilter){
    // Don't bother filtering, etc. if a user is without a bastion.
    // TODO - remove this once no-bastion mode is launched for real
    const hasActiveBastion = !!this.props.redux.env.activeBastion;
    if (!hasActiveBastion && !flag('check-type-external_host')) {
      return new List();
    }

    let data = this.props.redux.checks.checks
    .sortBy(item => item.name)
    .sortBy(item => {
      return item.health === undefined ? 101 : item.health;
    });
    if (noFilter){
      return data;
    }
    if (this.props.target){
      let tar = !Array.isArray(this.props.target) ? [this.props.target] : this.props.target;
      data = data.filter(c => {
        return tar.indexOf(c.get('target').get('id')) > -1;
      });
    }
    if (this.props.filter){
      data = this.props.redux.checks.filtered;
    }
    if (this.props.selected){
      data = data.filter(check => check.get('selected'));
    }
    return data
    .filter(item => {
      // Filter out everything except external checks if no bastion active
      // AND no-bastion mode enabled (Otherwise, users should just see an "install your bastion" requirement.)
      return hasActiveBastion || (flag('check-type-external_host') && item.toJS().target.type === 'external_host');
    })
    .slice(this.props.offset, this.props.limit);
  },
  handleSelectorClick(){
    this.props.actions.selectToggle();
  },
  renderTitle(){
    const checks = this.getChecks();
    const total = this.props.redux.checks.checks.size;
    let numbers = `(${total})`;
    if (checks.size < total){
      if (!this.props.target && !this.props.selected){
        numbers = `(${checks.size} of ${total})`;
      } else {
        numbers = `(${checks.size})`;
      }
    }
    if (!checks.size){
      numbers = '';
    }
    const selected = this.getSelectedChecks();
    const {size} = selected;
    const title = size > 0 ? 'Unselect All' : 'Select All';
    const inner = size > 0 ? <div className={listItem.selectorInner}/> : null;
    if (this.props.title && (!this.props.noFallback || (this.props.noFallback && checks.size))){
      return (
        <div className="display-flex">
          <Heading level={3} className="flex-1">Checks {numbers}</Heading>
          {this.props.selectable && <Button icon flat className={cx(listItem.selector, size > 0 && listItem.selectorSelected)} onClick={this.handleSelectorClick} title={title} style={{marginRight: '.8rem'}}>{inner}</Button>}
        </div>
      );
    }
    return null;
  },
  render() {
    const checks = this.getChecks();
    if (checks.size){
      return (
        <div>
          {this.renderTitle()}
          {checks.map(c => {
            return <CheckItem item={c} key={c.get('id')} selectable={this.props.selectable}/>;
          })}
        </div>
      );
    }
    return (
      <div>
        {this.renderTitle()}
        <StatusHandler status={this.props.redux.asyncActions.getChecks.status}>
          <Alert color="default">No checks found</Alert>
        </StatusHandler>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckItemList);