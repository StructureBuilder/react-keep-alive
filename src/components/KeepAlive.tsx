import React from 'react';
import noop from '../utils/noop';
import keepAlive, {IKeepAliveComponentProps} from '../utils/keepAlive';

export const keepAliveDisplayName = '$$KeepAlive';

interface IKeepAliveProps extends IKeepAliveComponentProps {
  key: string;
  onActivate?: () => void;
  onUnactivate?: () => void;
}

class KeepAlive extends React.PureComponent<IKeepAliveProps> {
  public displayName = keepAliveDisplayName;

  public static defaultProps = {
    onActivate: noop,
    onUnactivate: noop,
  };

  public componentDidActivate() {
    (this.props as any).onActivate();
  }

  public componentWillUnactivate() {
    (this.props as any).onUnactivate();
  }

  public render() {
    return this.props.children;
  }
}

export default keepAlive(KeepAlive) as React.ComponentClass<IKeepAliveProps>;
