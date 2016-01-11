import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Immutable from 'immutable';
import _ from 'lodash';

import {StatusHandler} from '../global';
import {Alert} from '../../modules/bootstrap';
import CheckItem from './CheckItem.jsx';
import {SetInterval} from '../../modules/mixins';
import {checks as actions} from '../../actions';
import {itemsFilter} from '../../modules';

const CheckItemList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    type: PropTypes.string,
    target: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    filter: PropTypes.bool,
    title: PropTypes.bool,
    actions: PropTypes.shape({
      getChecks: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object
      }),
      search: PropTypes.shape({
        string: PropTypes.string
      }),
      asyncActions: PropTypes.shape({
        getChecks: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.actions.getChecks();
    this.setInterval(this.props.actions.getChecks, 15000);
  },
  shouldComponentUpdate(nextProps) {
    const string1 = 'redux.asyncActions.getChecks.status';
    const bool1 = _.get(nextProps, string1) !== _.get(this.props, string1);
    const string2 = 'redux.checks.checks';
    const bool2 = !Immutable.is(_.get(nextProps, string2), _.get(this.props, string2));
    const bool3 = _.isEqual(this.props.target, nextProps.target);
    return bool1 || bool2 || bool3;
  },
  getChecks(){
    let data = this.props.redux.checks.checks;
    if (this.props.target){
      let tar = !Array.isArray(this.props.target) ? [this.props.target] : this.props.target;
      data = data.filter(c => {
        return tar.indexOf(c.get('target').id) > -1;
      });
    }
    if (this.props.filter){
      data = itemsFilter(data, this.props.redux.search);
    }
    return data.sortBy(item => {
      return item.get('health');
    });
  },
  renderTitle(){
    if (this.props.title){
      return <h3>Checks ({this.getChecks().size})</h3>;
    }
    return null;
  },
  render() {
    if (this.getChecks().size){
      return (
        <div>
          {this.renderTitle()}
          {this.getChecks().map(c => {
            return <CheckItem item={c} key={c.get('id')}/>;
          })}
        </div>
      );
    }
    return (
      <div>
        {this.renderTitle()}
        <StatusHandler status={this.props.redux.asyncActions.getChecks.status}>
          <Alert bsStyle="default">No checks found</Alert>
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