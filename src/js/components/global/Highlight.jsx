import hljs from 'highlight.js/lib/highlight';
import json from 'highlight.js/lib/languages/json';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
/* eslint-disable no-unused-vars */
import style from './hljs.css';
/* eslint-enable no-unused-vars */

hljs.registerLanguage('json', json);

const Highlight = React.createClass({
  propTypes: {
    innerHTML: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    noBg: PropTypes.bool,
    wrap: PropTypes.bool
  },
  getDefaultProps() {
    return {
      className: '',
      noBg: false,
      wrap: false
    };
  },
  componentDidMount() {
    this.runHighlightCode();
  },
  componentDidUpdate() {
    this.runHighlightCode();
  },
  getClassName(){
    return cx(this.props.className, {
      'noBg': this.props.noBg,
      'wrap': this.props.wrap
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
        <div dangerouslySetInnerHTML={{__html: this.props.children}} className={this.getClassName()}/>
      );
    }
    return (
      <pre>
        <code className={this.getClassName()}>
          {this.props.children}
        </code>
      </pre>
    );
  }
});

export default Highlight;