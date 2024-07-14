import * as React from 'react';

import type TSubject from '../../model/TSubject';

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

    /**
     * Unsubscribes from previous reloadTrigger subscription and subscribes to a new reloadTrigger subscription.
     * Whenever reloadTrigger emits a value, it forces the component to update.
     *
     * @method doSubscribe
     */
    doSubscribe = () => {
        this._disconnectListener && this._disconnectListener();
        this._disconnectListener = this.props.reloadTrigger.subscribe(() => {
            this.forceUpdate();
        });
    };

    /**
     * Invoked immediately after a component is mounted.
     *
     * @function componentDidMount
     */
    componentDidMount = () => {
        this.doSubscribe();
    };

    /**
     * Executes the necessary operations after the component is updated.
     */
    componentDidUpdate = () => {
        this.doSubscribe();
    };

    /**
     * Component lifecycle method that is called just before the component is unmounted and destroyed.
     * It is used to perform any necessary cleanup logic or clean up any resources that were previously allocated by this component.
     */
    componentWillUnmount = () => {
        if (this._disconnectListener) {
            this._disconnectListener();
        }
    };

    /**
     * Render lifecycle method
     */
    render = () => (
        <>
            {this.props.children}
        </>
    );
};

export default ReloadView;
