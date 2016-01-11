import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {BastionRequirement, Toolbar} from '../global';
import EnvList from './EnvList.jsx';
import {State} from 'react-router';
import {env as actions} from '../../actions';
import _ from 'lodash';

const Env = React.createClass({
  mixins: [State],
  propTypes: {
    location: PropTypes.object,
    actions: PropTypes.shape({
      envSetSearch: PropTypes.func,
      getBastions: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        search: PropTypes.string,
        bastions: PropTypes.array
      })
    })
  },
  componentWillMount(){
    if (this.props.location.query.search && !this.props.redux.env.search){
      this.props.actions.envSetSearch(this.props.location.query.search);
    }
    this.props.actions.getBastions();
  },
  getTitle(){
    const bastion = _.chain(this.props.redux.env.bastions).filter('connected').last().value() || {};
    const region = bastion.region || 'Environment';
    const vpcId = bastion.vpc_id || '';
    return `${region} - ${vpcId}`;
  },
  getInitialState(){
    const path = this.props.location.pathname;
    let include;
    if (path){
      if (path.match('groups-security')){
        include = ['groupsSecurity'];
      }else if (path.match('groups-elb')){
        include = ['groupsELB'];
      }else if (path.match('instances-ec2')){
        include = ['instancesECC'];
      }
    }
    return {
      include
    };
  },
  render() {
    return (
      <div>
        <Toolbar title={this.getTitle()}/>
          <Grid>
            <Row>
              <Col xs={12}>
                <BastionRequirement>
                  <EnvList include={this.state.include} filter limit={this.state.include && this.state.include.length === 1 ? 1000 : null} redux={this.props.redux}/>
                </BastionRequirement>
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

export default connect(null, mapDispatchToProps)(Env);