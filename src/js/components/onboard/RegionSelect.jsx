import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Toolbar} from '../global';
import {OnboardActions} from '../../actions';
import forms from 'newforms';
import {BoundField} from '../forms';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {onboard as actions} from '../../actions';
import regions from '../../modules/regions';

const regionChoices = regions.map(r => {
  return [r.id, `${r.id} - ${r.name}`];
});

const InfoForm = forms.Form.extend({
  regions: forms.ChoiceField({
    choices: regionChoices,
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'RadioSelect'
    }
  })
});

const RegionSelect = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setRegion: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      onboard: PropTypes.shape({
        region: PropTypes.string
      })
    })
  },
  getInitialState() {
    const self = this;
    const obj = {
      info: new InfoForm({
        onChange(){
          if (self.isMounted()){
            self.forceUpdate();
          }
        },
        labelSuffix: '',
        data: {
          regions: [this.props.redux.onboard.region]
        },
        validation: {
          on: 'blur change',
          onChangeDelay: 100
        }
      })
    };
    setTimeout(() => {
      obj.info.validate();
    }, 10);
    return obj;
  },
  componentWillMount(){
    OnboardActions.getBastions();
  },
  isDisabled(){
    return !this.state.info.cleanedData.regions || !this.state.info.cleanedData.regions.length;
  },
  runToggleAll(value){
    if (value){
      this.state.info.updateData({
        regions: regions.map(r => {
          return r.id;
        })
      });
    }else {
      this.state.info.updateData({regions: []});
    }
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.setRegion(this.state.info.cleanedData.regions);
  },
  renderInner(){
    if (!_.find(this.props.redux.env.bastions, 'connected')){
      return (
        <form name="loginForm" onSubmit={this.handleSubmit}>
         <p>Choose the region where you want to launch your Opsee Bastion Instance. The Bastion Instance will only be able to run health checks within this region.</p>
         {
         // <h2 className="h3">All AWS regions - <Button flat color="primary" onClick={this.runToggleAll.bind(this, true)}>Select All</Button> - <Button flat color="warning"  onClick={this.runToggleAll.bind(null, false)}>Deselect All</Button></h2>
         }
          <BoundField bf={this.state.info.boundField('regions')}/>
          <Padding t={1}>
            <Button color="success" block type="submit" disabled={this.isDisabled()} title={this.isDisabled() ? 'Choose a region to move on.' : 'Next'} chevron>Next</Button>
          </Padding>
        </form>
      );
    }
    return (
      <Padding tb={1}>
        <Alert bsStyle="info">
          It looks like you already have a bastion in your environment. At this time, Opsee only supports one bastion.
        </Alert>
      </Padding>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Choose a Region"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
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

export default connect(null, mapDispatchToProps)(RegionSelect);