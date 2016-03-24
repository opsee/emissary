import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';
import {Link} from 'react-router';

import {Highlight, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Expandable, Padding} from '../layout';
import {Heading} from '../type';
import {onboard as actions} from '../../actions';

const Templates = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        onboardGetTemplates: PropTypes.object
      }),
      onboard: PropTypes.shape({
        templates: PropTypes.array
      })
    }),
    actions: PropTypes.shape({
      getTemplates: PropTypes.func
    })
  },
  componentWillMount(){
    const item = this.props.redux.asyncActions.onboardGetTemplates;
    if (!item.status){
      this.props.actions.getTemplates();
    }
  },
  renderTemplates(){
    const {templates} = this.props.redux.onboard;
    const get = this.props.redux.asyncActions.onboardGetTemplates;
    if (get.status === 'success' && templates.length){
      return ['Ingress Role', 'CloudFormation Template', 'IAM Role'].map((title, index) => {
        const data = templates[index];
        return (
          <Padding b={2} key={`template-${index}`}>
            <Heading level={2}>{title}</Heading>
            <Heading level={4}>Last modified: {data.headers['last-modified']}</Heading>
            <Expandable style={{background: seed.color.gray9}}>
              <Highlight style={{padding: '1rem'}}>
                {JSON.stringify(data.body, null, ' ')}
              </Highlight>
            </Expandable>
          </Padding>
        );
      });
    } else if (typeof get.status === 'object'){
      return (
        <Padding b={2}>
          Please refer to <Link target="_blank" to="/help">our docs</Link> for information about our cloudformation, iam role, and ingress role templates.
        </Padding>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        <Toolbar title="Required AWS Templates"/>
        <Grid>
          <Row>
            <Col xs={12}>
            {this.renderTemplates()}
            <Button to="/start/credentials" color="success" block chevron>Next</Button>
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

export default connect(null, mapDispatchToProps)(Templates);