import * as React from 'react';

import TSubject from '../../model/TSubject';

/**
 * Interface for the props of a ReloadView component.
 */
interface IReloadViewProps {
    reloadTrigger: TSubject<any>;
    children?: React.ReactNode;
}

/**
 * Represents a reload view component.
 * @class
 * @public
 */
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

    render = () => (
        <>
            {this.props.children}
        </>
    );
};

export default ReloadView;
