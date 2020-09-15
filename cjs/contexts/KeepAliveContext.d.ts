import * as React from 'react';
import { IKeepAliveProviderImpl, IKeepAliveProviderProps } from '../components/Provider';
export declare type IKeepAliveContextProps = IKeepAliveProviderImpl & IKeepAliveProviderProps;
declare const KeepAliveContext: React.Context<IKeepAliveContextProps>;
export default KeepAliveContext;
