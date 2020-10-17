import * as React from 'react';
import { ICache, ICacheItem } from './Provider';
interface IConsumerProps {
    children: React.ReactNode;
    identification: string;
    keepAlive: boolean;
    cache: ICache;
    setCache: (identification: string, value: ICacheItem) => void;
    unactivate: (identification: string) => void;
}
declare class Consumer extends React.PureComponent<IConsumerProps> {
    private renderElement;
    private commentRef;
    private identification;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default Consumer;
