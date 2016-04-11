import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {State} from 'react-router';
import _ from 'lodash';

import {BastionRequirement, Toolbar} from '../global';
import {Col, Grid, Row} from '../layout';
import EnvList from './EnvList.jsx';
import {env as actions} from '../../actions';

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
    this.props.actions.getBastions();
  },
  getTitle(){
    const bastion = _.chain(this.props.redux.env.bastions).filter('connected').last().value() || {};
    const region = bastion.region || 'Environment';
    const vpcId = bastion.vpc_id || '';
    return `${region} - ${vpcId}`;
  },
  getIncludes(){
    const {pathname} = this.props.location;
    let include = ['groups.elb', 'groups.security', 'instances.rds', 'instances.ecc'];
    if (pathname){
      if (pathname.match('groups-security')){
        include = ['groups.security'];
      } else if (pathname.match('groups-elb')){
        include = ['groups.elb'];
      } else if (pathname.match('instances-ec2')){
        include = ['instances.ecc'];
      }
    }
    return include;
  },
  render() {
    return (
      <div>
        <Toolbar title={this.getTitle()}/>
          <Grid>
            <Row>
              <Col xs={12}>
                <BastionRequirement>
                  <EnvList include={this.getIncludes()} limit={this.getIncludes() && this.getIncludes().length === 1 ? 1000 : 8} redux={this.props.redux} showFilterButtons/>
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