import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Link} from 'react-router';
import TimeAgo from 'react-timeago';

import {Table} from '../global';
import {Col, Row} from '../layout';

const PlanInfo = React.createClass({
  propTypes: {
    team: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    checks: PropTypes.object.isRequired,
    base: PropTypes.string
  },
  getInitialState() {
    return {
      showInvoices: false
    };
  },
  getPlan(team){
    let plan = team.subscription_plan;
    if (plan === 'beta'){
      plan = 'Team (beta)';
    }
    if (plan === 'developer_monthly'){
      plan = 'Developer';
    }
    if (plan === 'team_monthly'){
      plan = 'Team'
    }
    return _.capitalize(plan);
  },
  getTrialEnding(team){
    let end = team.subscription_trial_end;
    end = end && end * 1000 || undefined;
    const d = Date.now();
    if (end && end > d){
      return (
        <span>
          Ending <TimeAgo date={end}/>
        </span>
      );
    }
    return null;
  },
  isBilling(){
    const user = this.props.user.toJS();
    return !!(user.perms.admin || user.perms.billing);
  },
  handleInvoicesClick(e){
    e.preventDefault();
    this.setState({
      showInvoices: true
    });
  },
  renderSubscriptionPlan(team = this.props.team.toJS(), base){
    if (this.isBilling()){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Subscription Plan</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                <Link to={`/${base}/edit`}>{this.getPlan(team)}</Link>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderTrial(team){
    const ending = this.getTrialEnding(team);
    if (ending){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Trial</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                {ending}
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderCCDetails(team = this.props.team.toJS(), base){
    if (this.isBilling()){
      const cc = team.credit_card_info;
      if (_.keys(cc).length){
        return (
          <tr>
            <td colSpan={2}>
              <Row>
                <Col xs={12} sm={4}>
                  <strong>Credit Card</strong><br/>
                </Col>
                <Col xs={12} sm={8}>
                  <Link to={`/${base}/edit`}>{cc.brand} ****{cc.last4} Exp {cc.exp_month}/{cc.exp_year}</Link>
                </Col>
              </Row>
            </td>
          </tr>
        );
      }
    }
    return null;
  },
  renderInvoices(team = this.props.team.toJS()){
    let invoices = _.reject(team.invoices, i => !i.amount);
    const cut = this.state.showInvoices ? Infinity : 3;
    const rest = invoices.length - cut;
    invoices = _.take(invoices, cut);
    if (this.isBilling() && invoices.length){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Invoices</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                {invoices.map(i => {
                  return (
                    <div>${(i.amount / 100).toFixed(2)} billed <TimeAgo date={i.date * 1000}/></div>
                  );
                })}
                {!this.state.showInvoices && rest > 0 && <a href="#" onClick={this.handleInvoicesClick}>Show {rest} more</a>}
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderCostEstimate(team = this.props.team.toJS()){
    const inv = team.next_invoice;
    if (this.isBilling() && _.keys(inv).length){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Next Invoice</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                ${(inv.amount / 100).toFixed(2)} billed <TimeAgo date={inv.date * 1000}/>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  render() {
    const team = this.props.team.toJS();
    const {base} = this.props;
    const isTeam = !!(this.props.team.users.size > 1);
    if ((base === 'profile' && !isTeam) || base === 'team'){
      return (
        <Table>
          {this.renderSubscriptionPlan(team, base)}
          {this.renderTrial(team)}
          {this.renderCCDetails(team, base)}
          {this.renderInvoices(team)}
          {this.renderCostEstimate(team)}
        </Table>
      );
    }
    return null;
  }
});

const mapStateToProps = (state) => ({
  team: state.team,
  user: state.user,
  checks: state.checks.checks
});

export default connect(mapStateToProps)(PlanInfo);