import * as React from 'react';
export interface IIdentificationContextProps {
    identification: string;
    eventEmitter: any;
    keepAlive: boolean;
    getLifecycle: () => number;
    isExisted: () => boolean;
    activated: boolean;
    extra: any;
}
declare const WithKeepAliveContext: React.Context<IIdentificationContextProps>;
export default WithKeepAliveContext;
