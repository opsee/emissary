import React, {PropTypes} from 'react';
import _ from 'lodash';

import Highlight from '../global/Highlight';
import Padding from '../layout/Padding';
import Color from '../type/Color';

const CheckResponseSingle = React.createClass({
  propTypes: {
    code: PropTypes.number,
    body: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    headers: PropTypes.object,
    json: PropTypes.bool,
    metrics: PropTypes.array
  },
  getDefaultProps() {
    return {
      code: undefined,
      body: null,
      headers: {},
      metrics: []
    };
  },
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  },
  getBody(){
    const {props} = this;
    if (_.isObject(props.body)){
      return JSON.stringify(props.body, null, ' ');
    }
    return props.body || '';
  },
  getMetric(name){
    const data = _.chain(this.props.metrics).find({name}).get('value').value();
    if (name === 'request_latency' && typeof data === 'number'){
      return Math.round(data);
    }
    return data;
  },
  renderHeaders(){
    return (
      <div>
        {_.chain(this.props.headers).keys().map((key, i) => {
          return (
            <div key={`header-${i}`}>
              <code style={{fontSize: '1.4rem'}}>{key}:&nbsp;<Color c="primary">{this.props.headers[key]}</Color></code>
            </div>
          );
        }).value()}
      </div>
    );
  },
  render(){
    return (
      <div>
        <Padding t={1}>
          <div>
            <strong>Status Code:</strong>&nbsp;<Color c="primary"><code style={{fontSize: '1.5rem'}}>{this.props.code}</code></Color>
          </div>
          <Padding t={1}>
            <strong>Metrics</strong>
          </Padding>
          <div>
            <code style={{fontSize: '1.5rem'}}>Round-Trip Time:&nbsp;<Color c="primary">{this.getMetric('request_latency')} ms</Color></code>
          </div>
        </Padding>
        <Padding t={1} b={1}>
          <Padding b={0.5}>
            <strong>Headers</strong>
          </Padding>
          {this.renderHeaders()}
        </Padding>
        <Padding b={0.5}>
          <strong>Body</strong>
        </Padding>
        <Padding>
          <Highlight>
            {this.getBody()}
          </Highlight>
        </Padding>
      </div>
    );
  }
});

export default CheckResponseSingle;