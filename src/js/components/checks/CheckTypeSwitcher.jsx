import React, {PropTypes} from 'react';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Button} from '../forms';
import {Heading} from '../type';
import {Padding} from '../layout';
import {
  app as appActions
} from '../../actions';

const CheckTypeSwitcher = React.createClass({
  propTypes: {
    check: PropTypes.object.isRequired,
    appActions: PropTypes.shape({
      confirmOpen: PropTypes.func.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    types: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  },
  // componentWillMount(){
  // },
  runChangeCheckType(){
    let check = _.cloneDeep(this.props.check);
    if (check.type === 'http'){
      check.type = 'cloudwatch';
      check.spec = _.assign(check.spec, {metrics: []});
      check.assertions = [];
    } else if (check.type === 'cloudwatch'){
      check.type = 'http';
      check.spec = _.defaults(check.spec, {
        path: '/',
        protocol: 'http',
        port: '80',
        verb: 'GET',
        headers: []
      });
      check.assertions = [];
    }
    this.props.onChange(check);
    const data = window.encodeURIComponent(JSON.stringify(check));
    let path = `/check-create/assertions-cloudwatch?data=${data}`;
    if (check.type === 'http'){
      path = `/check-create/request?data=${data}`;
    }
    this.props.history.push(path);
  },
  handleCheckTypeChange(type = 'CloudWatch'){
    const length = this.props.check.assertions.length;
    if (length){
      return this.props.appActions.confirmOpen({
        html: `<p>You currently have ${length} assertion${length > 1 ? 's' : ''}. These will be lost if you switch to a ${type} check.</p>`,
        confirmText: 'Ok, no problem',
        color: 'success',
        onConfirm: this.runChangeCheckType
      });
    }
    return this.runChangeCheckType();
  },
  render(){
    const {check} = this.props;
    const id = check.target.type;
    const obj = _.find(this.props.types, {id});
    const opposite = check.type === 'http' ? 'cloudwatch' : 'http';
    if (obj && _.includes(obj.types, opposite)){
      return (
        <Padding b={1}>
          <Heading level={3}>Choose a Check Type</Heading>
          <Padding inline r={1}>
            <Button color="primary" flat={check.type === 'cloudwatch'} title="HTTP Request" onClick={this.handleCheckTypeChange.bind(null, 'HTTP')}>HTTP Request</Button>
          </Padding>
          <Button color="primary" flat={check.type === 'http'} title="CloudWatch Metrics" onClick={this.handleCheckTypeChange.bind(null, 'CloudWatch')}>CloudWatch Metrics</Button>
        </Padding>
      );
    }
    return null;
  }
});

const mapDispatchToProps = (dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(CheckTypeSwitcher);