import * as React from 'react';
interface IReactCommentProps {
    onLoaded: () => void;
}
declare class ReactComment extends React.PureComponent<IReactCommentProps> {
    static defaultProps: {
        onLoaded: () => undefined;
    };
    private parentNode;
    private currentNode;
    private commentNode;
    private content;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private createComment;
    render(): JSX.Element;
}
export default ReactComment;
