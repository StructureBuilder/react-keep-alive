import React from 'react';
import ReactDOM from 'react-dom';
import noop from '../utils/noop';

interface IReactCommentProps {
  onLoaded: () => void;
}

class ReactComment extends React.PureComponent<IReactCommentProps> {
  public static defaultProps = {
    onLoaded: noop,
  };

  private parentNode: Node;

  private currentNode: Element;

  private commentNode: Comment;

  private content: string;

  public componentDidMount() {
    const node = ReactDOM.findDOMNode(this) as Element;
    const commentNode = this.createComment();
    this.commentNode = commentNode;
    this.currentNode = node;
    this.parentNode = node.parentNode as Node;
    this.parentNode.replaceChild(commentNode, node);
    ReactDOM.unmountComponentAtNode(node);
    this.props.onLoaded();
  }

  public componentWillUnmount() {
    this.parentNode.replaceChild(this.currentNode, this.commentNode);
  }

  private createComment() {
    let content = this.props.children;
    if (typeof content !== 'string') {
      content = '';
    }
    this.content = (content as string).trim();
    return document.createComment(this.content);
  }

  public render() {
    return <div />;
  }
}

export default ReactComment;
