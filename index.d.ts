import React from 'react';

export interface IKeepAliveProps {
    key?: string;
    name?: string;
    disabled?: boolean;
    extra?: any;
}

export const KeepAlive: React.ComponentType<IKeepAliveProps>;

export interface IKeepAliveProviderProps {
  include?: string | string[] | RegExp;
  exclude?: string | string[] | RegExp;
}

export const Provider: React.ComponentType<IKeepAliveProviderProps>;

export function useKeepAliveEffect(effect: React.EffectCallback): void

export function bindLifecycle<P = any>(Component: React.ComponentClass<P>): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<{}>> & {
  contextType: React.Context<any> | undefined;
  getDerivedStateFromError: React.GetDerivedStateFromError<P, any> | undefined;
};
