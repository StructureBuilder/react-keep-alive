import * as React from 'react';
import {IKeepAliveProviderImpl, IKeepAliveProviderProps} from '../components/Provider';

export type IKeepAliveContextProps = IKeepAliveProviderImpl & IKeepAliveProviderProps;

const KeepAliveContext = React.createContext<IKeepAliveContextProps>({} as any);

export default KeepAliveContext;
