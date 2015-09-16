import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {DocsStore} from '../../stores';
import {DocsActions} from '../../actions';

function getState(){
  return {
    data:DocsStore.getCloudFormationTemplate(),
    status:DocsStore.getDocsGetCloudFormationTemplateStatus()
  }
}

export default React.createClass({
  mixins:[DocsStore.mixin],
  storeDidChange(){
    const status = DocsStore.getDocsGetCloudFormationTemplateStatus();
    if(status == 'success'){
      this.setState(getState());
    }
  },
  getInitialState(){
    return getState();
  },
  componentWillMount(){
    DocsActions.docsGetCloudFormationTemplate();
  },
  render() {
    if(this.state.data){
      return (
        <pre>{JSON.stringify(this.state.data, null, ' ')}</pre>
      )
    }else{
      return <div/>
    }
  }
});
