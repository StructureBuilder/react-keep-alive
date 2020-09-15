import * as React from 'react';
import { IIdentificationContextProps } from '../contexts/IdentificationContext';
export interface IIdentificationContextConsumerComponentProps {
    _identificationContextProps: IIdentificationContextProps;
}
export declare const withIdentificationContextConsumerDisplayName = "withIdentificationContextConsumer";
export default function withIdentificationContextConsumer<P = any>(Component: React.ComponentType<IIdentificationContextConsumerComponentProps & P>): {
    (props: P): JSX.Element;
    displayName: string;
};
