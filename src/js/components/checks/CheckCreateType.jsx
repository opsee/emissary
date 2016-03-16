import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {History} from 'react-router';

import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {BastionRequirement, Toolbar} from '../global';
import {Close} from '../icons';
import {UserDataRequirement} from '../user';
import {Padding} from '../layout';
import {Heading} from '../type';
import {checks as actions, user as userActions} from '../../actions';
import {flag} from '../../modules';

const CheckCreateType = React.createClass({
  mixins: [History],
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool,
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object,
          elb: PropTypes.object
        }),
        instances: PropTypes.shape({
          ecc: PropTypes.object,
          rds: PropTypes.object
        })
      })
    })
  },
  getItemStyle(){
    return {
      textAlign: 'left',
      margin: '0 1rem 1rem 0'
    };
  },
  getTypes(){
    const self = this;
    const initial = [
      {
        id: 'elb',
        title: 'ELB',
        size(){
          return self.props.redux.env.groups.elb.size;
        }
      },
      {
        id: 'security',
        title: 'Security Group',
        size(){
          return self.props.redux.env.groups.security.size;
        }
      },
      {
        id: 'ecc',
        title: 'EC2 Instance',
        size(){
          return self.props.redux.env.instances.ecc.size;
        }
      },
      {
        id: 'url',
        title: 'URL',
        size(){
          return '';
        }
      }
    ];
    return _.reject(initial, type => {
      return !flag(`check-type-${type.id}`);
    });
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckTypeHelp');
  },
  renderHelperText(){
    return (
      <UserDataRequirement hideIf="hasDismissedCheckTypeHelp">
        <Padding b={2}>
          <Alert bsStyle="success" onDismiss={this.runDismissHelperText}>
            <p>Let’s create a check! The first step is to choose your target type. If you choose a Group or ELB, Opsee will automatically check all of its instances, even if it changes.</p>
          </Alert>
        </Padding>
      </UserDataRequirement>
    );
  },
  renderInner(){
    return (
      <div>
        {this.renderHelperText()}
        <Padding b={1}>
          <Heading level={3}>Choose a Target Type</Heading>
        </Padding>
        {this.getTypes().map(type => {
          const data = JSON.stringify({target: {type: type.id}});
          return (
            <Button to={`/check-create/target?data=${data}`} style={this.getItemStyle()} color="primary" flat key={`type-select-${type.id}`}>
              <span>
                <strong>{type.title}&nbsp;</strong>
              </span>
              <span style={{display: 'inline-block', textAlign: 'left'}}>
                {type.size()}
              </span>
            </Button>
          );
        })}
      </div>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (1 of 5)" bg="info">
          <Button icon flat to="/">
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement>
                {this.renderInner()}
              </BastionRequirement>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
  render() {
    return this.props.renderAsInclude ? this.renderInner() : this.renderAsPage();
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckCreateType);