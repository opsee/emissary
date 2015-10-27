import hljs from 'highlight.js/lib/highlight';
import json from 'highlight.js/lib/languages/json';
import React, {PropTypes} from 'react';

hljs.registerLanguage('json', json);

const Highlight = React.createClass({
  propTypes: {
    innerHTML: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
  },
  getDefaultProps: function getDefaultProps() {
    return {
      innerHTML: false,
      className: ''
    };
  },
  componentDidMount() {
    this.runHighlightCode();
  },
  componentDidUpdate() {
    this.runHighlightCode();
  },
  runHighlightCode() {
    const domNode = this.getDOMNode();
    const nodes = domNode.querySelectorAll('pre code');
    if (nodes.length > 0) {
      for (let i = 0; i < nodes.length; i = i + 1) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  },
  render() {
    if (this.props.innerHTML) {
      return React.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.children }, className: this.props.className || null });
    }
    return React.createElement(
      'pre',
      null,
      React.createElement(
        'code',
        { className: this.props.className },
        this.props.children
      )
    );
  }
});

export default Highlight;