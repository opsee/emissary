import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Immutable from 'immutable';

import {StatusHandler} from '../global';
import {Alert} from '../layout';
import CheckItem from './CheckItem.jsx';
import {SetInterval} from '../../modules/mixins';
import {checks as actions} from '../../actions';
import {Heading} from '../type';

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
      getChecks: PropTypes.func
    }),
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
  getChecks(noFilter){
    let data = this.props.redux.checks.checks;
    data = data
    .map(item => {
      return Immutable.Map(item).set('pending', item.deleting);
    })
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
        return tar.indexOf(c.get('target').id) > -1;
      });
    }
    if (this.props.filter){
      data = this.props.redux.checks.filtered;
    }
    if (this.props.selected){
      data = data.filter(check => check.get('selected'));
    }
    return data.slice(this.props.offset, this.props.limit);
  },
  renderTitle(){
    let numbers = `(${this.getChecks(true).size})`;
    if (this.getChecks().size < this.getChecks(true).size){
      if (!this.props.target && !this.props.selected){
        numbers = `(${this.getChecks().size} of ${this.getChecks(true).size})`;
      } else {
        numbers = `(${this.getChecks().size})`;
      }
    }
    if (!this.getChecks().size){
      numbers = '';
    }
    if (this.props.title && (!this.props.noFallback || (this.props.noFallback && this.getChecks().size))){
      return <Heading level={3}>Checks {numbers}</Heading>;
    }
    return null;
  },
  render() {
    if (this.getChecks().size){
      return (
        <div>
          {this.renderTitle()}
          {this.getChecks().map(c => {
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