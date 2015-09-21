import React from 'react';
import {RadialGraph, ListItem} from '../global';
import {CheckActions} from '../../actions';
import Link from 'react-router/lib/components/Link'
import {MoreHoriz} from '../icons';
import colors from 'seedling/colors';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';

export default React.createClass({
  getInitialState() {
    return this.props;
  },
  silence(id){
    CheckActions.silence(id);
  },
  getGroupLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `group${suffix}`;
  },
  render() {
    return (
      <div className="display-flex flex-vertical-align">
        <Link to={this.getGroupLink()} params={{id:this.props.item.get('id')}} className="link-style-1 flex-1" style={{maxWidth:'100%'}}>
          <ListItem>
            <RadialGraph {...this.state.item.toJS()}/>
            <div className="padding-tb line-height-1 flex-1">
              <div className="list-item-line">{this.state.item.get('name')}</div>
              {
              // <div className="text-secondary">X of Y passing (N instances)</div>
              }
            </div>
          </ListItem>
        </Link>
        {
        // <Button icon={true} flat={true} onClick={this.silence.bind(this,this.state.item.get('id'))} title="Silence Group">
        //   <MoreHoriz btn={true}/>
        // </Button>
        }
      </div>
    );
  }
});