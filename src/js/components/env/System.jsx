import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import config from '../../modules/config';
import {user as actions} from '../../reduxactions';

const System = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getCustomer: PropTypes.func,
      getData: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        bastions: PropTypes.array.isRequired
      }),
      asyncActions: PropTypes.shape({
        envGetBastions: PropTypes.object.isRequired
      }),
      user: PropTypes.object
    })
  },
  getInitialState(){
    return {
      bastions: undefined
    };
  },
  componentWillMount(){
    this.props.actions.getCustomer();
    this.props.actions.getData();
  },
  renderBastionList(){
    if (this.props.redux.env.bastions.length){
      return (
        <div>
          <h3>Connected Bastions</h3>
          <ul>
            {this.props.redux.env.bastions.map(bastion => {
              return <li key={`bastion-${bastion}`}>EC2 Instance ID: {bastion}</li>;
            })}
          </ul>
        </div>
      );
    }
    return <h3>No Connected Bastions.</h3>;
  },
  renderBastionsInfo(){
    const status = this.props.redux.asyncActions.envGetBastions.status;
    if (status === 'success'){
      return this.renderBastionList();
    }
    return <StatusHandler status={status}/>;
  },
  renderCustomerInfo(){
    if (this.props.redux.user.get('customerId')){
      return (
        <Padding t={3}>
          <div><strong>Customer ID:</strong>&nbsp;<span className="text-secondary">{this.props.redux.user.get('customerId')}</span></div>
        </Padding>
      );
    }
    return <div/>;
  },
  render() {
    return (
      <div>
        <Toolbar title="System Status"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderBastionsInfo()}
              {this.renderCustomerInfo()}
              <strong>App Revision:</strong>&nbsp;<span className="text-secondary">{config.revision}</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(System);