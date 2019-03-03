import React from 'react';
import ReactDOM from 'react-dom';
import noop from '../utils/noop';

export default class Comment extends React.PureComponent {
  parentNode = null;
  currentNode = null;
  commentNode = null;
  content = null;

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const commentNode = this.createComment();
    this.commentNode = commentNode;
    this.currentNode = node;
    this.parentNode = node.parentNode;
    this.parentNode.replaceChild(commentNode, node);
    ReactDOM.unmountComponentAtNode(node);
    this.props.onLoaded();
  }

  componentWillUnmount() {
    this.parentNode.replaceChild(this.currentNode, this.commentNode);
  }

  createComment() {
    let content = this.props.children;
    if (typeof content !== 'string') {
      content = '';
    }
    content = content.trim();
    this.content = content;
    return document.createComment(content);
  }

  render() {
    return <div />;
  }
}

Comment.defaultProps = {
  onLoaded: noop,
};