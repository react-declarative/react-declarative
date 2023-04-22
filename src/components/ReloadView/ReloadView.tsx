import * as React from 'react';

import TSubject from '../../model/TSubject';

interface IReloadViewProps {
    reloadTrigger: TSubject<any>;
    children?: React.ReactNode;
}

export class ReloadView extends React.Component<IReloadViewProps> {

    _disconnectListener: (() => void) | undefined;

    doSubscribe = () => {
        this._disconnectListener && this._disconnectListener();
        this._disconnectListener = this.props.reloadTrigger.subscribe(() => {
            this.forceUpdate();
        });
    };

    componentDidMount = () => {
        this.doSubscribe();
    };

    componentDidUpdate = () => {
        this.doSubscribe();
    };

    componentWillUnmount = () => {
        if (this._disconnectListener) {
            this._disconnectListener();
        }
    };

    return = () => (
        <>
            {this.props.children}
        </>
    );
};

export default ReloadView;
