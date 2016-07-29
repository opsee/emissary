import React from 'react';
import {Link} from 'react-router';
import {Toolbar} from '../global';
import {Col, Grid, Panel, Row} from '../layout';
import {Heading} from '../type';

const Billing = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Billing"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                <p>Your Opsee bill is based on the number of checks you have running each month, as well as the features you use. Each plan is summarized below, and each paid plan includes a 14-day free trial with no credit card required.</p>

                <Heading level={2}>Billing Plans</Heading>
                <ol>
                  <li><strong>Free</strong>: the Free plan is for users with a single check. You do not need a credit card on file, and will not be charged anything to run a single check. You will not have access to some of our more advanced features, though, such as historical data and multi-user access to your account.</li>
                  <li><strong>Developer</strong>: Our Developer plan costs $5 per month for each check. If you have more than one check you are eligible for the Developer plan. All features apart from historical data and multi-user access are available at this level.</li>
                  <li><strong>Team</strong> (coming soon): Our Team plan costs $10 per month for each check. If you have more than one check you are eligible for the Team plan. All Opsee features, including historical data and multi-user access, are available at this level.</li>
                </ol>

                <Heading level={2}>Choosing and Changing Billing Plans</Heading>
                <p>To choose or change a plan, head to your <Link to="/billing">Billing page</Link>. To turn off payments, choose the Free plan.</p>

                <Heading level={2}>Trial</Heading>
                <p>Every new customer receives a 14-day free trial, with access to all features and unlimited checks, that begins when you sign up. You will not be billed until the end of your trial.</p>

                <Heading level={2}>Payments Processing and Credit Cards</Heading>
                <p>Our payments are processed by Stripe, and Visa, MasterCard, American Express, JCB, Discover, and Diners Club cards are accepted.</p>

              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Billing;