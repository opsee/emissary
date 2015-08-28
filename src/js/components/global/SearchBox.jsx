import React, {PropTypes} from 'react';
import Autosuggest from 'react-autosuggest';
import router from '../../router.jsx';

export default React.createClass({
  getInitialState(){
    return {
      hidden:true
    }
  },
  submit(e, foo){
    e.preventDefault();
    console.log(foo);
  },
  getData(input, cb){
    let routes = router.getAllRoutes();
    const data = _.chain(routes).filter(r => {
      return r.name && r.name.match(input);
    }).map(r => r.name).value();
    cb(null, data);
  },
  selectItem(choice, event){
    router.transitionTo(choice);
    this.setState({hidden:true});
  },
  inputAttributes:{
    placeholder:'Search for a Page Route',
    id:'searchBoxInput'
  },
  render(){
    const self = this;
    document.onkeydown = function(e){
      switch(e.which){
        //forward slash
        case 191:
        if(e.srcElement && (e.srcElement.nodeName == 'BODY' || e.srcElement.id == 'searchBoxInput')){
          const isHidden = !!self.state.hidden;
          self.setState({hidden:!isHidden});
          if(isHidden){
            const el = document.querySelector('#searchBox input');
            if(el){
              setTimeout(() => el.focus(),100);
            }
          }
        }
        break;
        //escape key
        case 27:
        self.setState({hidden:true});
        break;
      }
    }
    if(!this.state.hidden){
      return(
        <div id="searchBox">
          <Autosuggest suggestions={this.getData} onSuggestionSelected={this.selectItem} inputAttributes={this.inputAttributes}/>
        </div>
      )
    }else{
      return <div/>
    }
  }
})