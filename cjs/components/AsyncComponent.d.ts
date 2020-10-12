import * as React from 'react';
interface IProps {
    setMounted: (value: boolean) => void;
    getMounted: () => boolean;
    onUpdate: () => void;
}
interface IState {
    component: any;
}
export default class AsyncComponent extends React.Component<IProps, IState> {
    state: {
        component: null;
    };
    /**
     * Force update child nodes
     *
     * @private
     * @returns
     * @memberof AsyncComponent
     */
    private forceUpdateChildren;
    componentDidMount(): void;
    componentDidUpdate(): void;
    shouldComponentUpdate(): boolean;
    render(): null;
}
export {};
