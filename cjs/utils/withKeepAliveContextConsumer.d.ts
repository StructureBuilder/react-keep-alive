import * as React from 'react';
import { IKeepAliveContextProps } from '../contexts/KeepAliveContext';
export interface IKeepAliveContextConsumerComponentProps {
    _keepAliveContextProps: IKeepAliveContextProps;
}
export declare const WithKeepAliveContextConsumerDisplayName = "withKeepAliveContextConsumer";
export default function withKeepAliveContextConsumer<P = any>(Component: React.ComponentType<IKeepAliveContextConsumerComponentProps & P>): {
    (props: P): JSX.Element;
    displayName: string;
};
