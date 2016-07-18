import hljs from 'highlight.js/lib/highlight';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import cx from 'classnames';
/* eslint-disable no-unused-vars */
import style from './hljs.css';
/* eslint-enable no-unused-vars */

hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);

const Highlight = React.createClass({
  propTypes: {
    innerHTML: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    noBg: PropTypes.bool,
    wrap: PropTypes.bool,
    style: PropTypes.object,
    padding: PropTypes.bool
  },
  getDefaultProps() {
    return {
      className: '',
      noBg: false,
      wrap: false,
      style: {}
    };
  },
  componentDidMount() {
    this.runHighlightCode();
  },
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps.children, this.props.children);
  },
  componentDidUpdate() {
    this.runHighlightCode();
  },
  getClassName(){
    return cx(this.props.className, {
      'noBg': this.props.noBg,
      'wrap': this.props.wrap,
      'padding': this.props.padding
    });
  },
  runHighlightCode() {
    if (this.isMounted()){
      const domNode = ReactDOM.findDOMNode(this);
      const nodes = domNode.querySelectorAll('pre code');
      if (nodes.length > 0) {
        for (let i = 0; i < nodes.length; i = i + 1) {
          hljs.highlightBlock(nodes[i]);
        }
      }
    }
  },
  render() {
    if (this.props.innerHTML) {
      return (
        <div dangerouslySetInnerHTML={{__html: this.props.children}} className={this.getClassName()} style={this.props.style}/>
      );
    }
    return (
      <pre>
        <code className={this.getClassName()} style={this.props.style}>
          {this.props.children}
        </code>
      </pre>
    );
  }
});

export default Highlight;