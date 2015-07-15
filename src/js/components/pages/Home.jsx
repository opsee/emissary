import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import TaskList from '../TaskList.jsx';
import RadialGraph from '../global/RadialGraph.jsx';
import TodoStore from '../../stores/TodoStore';
import ActionCreator from '../../actions/Todo';
import Toolbar from '../global/Toolbar.jsx';

export default React.createClass({
  _onChange() {
    this.setState(TodoStore.getAll());
  },

  getInitialState() {
    return TodoStore.getAll();
  },

  componentDidMount() {
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    TodoStore.removeChangeListener(this._onChange);
  },

  handleAddTask(e) {
    let title = prompt('Enter task title:');
    if (title) {
      ActionCreator.addItem(title);
    }
  },

  handleClear(e) {
    ActionCreator.clearList();
  },

  getDefaultProps() {
    return {
      tasks: []
    }
  },

  render() {
    let {tasks} = this.state;
    return (
      <div>
        <Toolbar title="Environment"/>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                <ul className="nav nav-tabs">
                  <li className="{active:$state.is('home.instances')}">
                    <a href="#" ui-sref="home.instances">Instances</a>
                  </li>
                  <li className="{active:$state.is('home.groups')}">
                    <a href="#" ui-sref="home.groups">Groups</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
      </div>
    );
  }
});
