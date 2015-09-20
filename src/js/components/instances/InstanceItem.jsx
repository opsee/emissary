import React, {PropTypes} from 'react';
import {RadialGraph} from '../global';
import {CheckActions} from '../../actions';
import {Link} from 'react-router';
import {MoreHoriz} from '../icons';
import colors from 'seedling/colors';
import Immutable, {Record} from 'immutable';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';

export default React.createClass({
  propTypes:{
    item:React.PropTypes.instanceOf(Record).isRequired,
  },
  getInitialState() {
    return this.props;
  },
  silence(id){
    return console.log('silence');
    CheckActions.silence(id);
  },
  getInstanceLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `instance${suffix}`;
  },
  render() {
    return (
      <div className="display-flex flex-vertical-align">
        <Link to={this.getInstanceLink()} params={{id:this.state.item.get('id')}} className="flex-1 display-flex flex-vertical-align link-style-1">
          <RadialGraph {...this.state.item.toJS()}/>
          <div className="padding-tb line-height-1">
            <div className="opsee-list-item-line">{this.state.item.get('name')}</div>
            <div className="opsee-list-item-line text-secondary">X of Y passing (N instances)</div>
          </div>
        </Link>{
        //   <button type="button" className="btn btn-icon btn-flat" onClick={this.silence.bind(this,this.state.item.get('id'))} title="Silence Instance">
        //   <MoreHoriz btn={true}/>
        // </button>
        }
      </div>
    );
  }
});