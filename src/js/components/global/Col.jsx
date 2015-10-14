import hljs from 'highlight.js/lib/highlight';
import json from 'highlight.js/lib/languages/json';
import React from 'react';

hljs.registerLanguage('json', json);

var Highlight = React.createClass({
  displayName: 'Highlight',

  getDefaultProps: function getDefaultProps() {
    return {
      innerHTML: false,
      className: ''
    };
  },
  componentDidMount: function componentDidMount() {
    this.highlightCode();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.highlightCode();
  },
  highlightCode: function highlightCode() {
    var domNode = this.getDOMNode();
    var nodes = domNode.querySelectorAll('pre code');
    if (nodes.length > 0) {
      for (var i = 0; i < nodes.length; i = i + 1) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  },
  render: function render() {
    if (this.props.innerHTML) {
      return React.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.children }, className: this.props.className || null });
    } else {
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
  }
});

export default Highlight;