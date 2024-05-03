import * as React from 'react'

import { BrowserHistory, HashHistory, MemoryHistory } from 'history';

import TSubject from '../../model/TSubject';

/**
 * Represents the props of an ErrorBoundary component.
 */
interface IErrorBoundaryProps {
  onError?: (error: Error, errorInfo: any) => void;
  history?: MemoryHistory | BrowserHistory | HashHistory;
  reloadSubject?: TSubject<void>;
  children?: React.ReactNode;
}

/**
 * @typedef IErrorBoundaryState
 * @property hasError - Indicates if an error has occurred.
 */
interface IErrorBoundaryState {
  hasError: boolean;
}

/**
 * Represents an error boundary component in React.
 */
export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {

  private unHistory?: () => void;
  private unReload?: () => void;

  /**
   * Returns an object that represents the new state for a component when an error is thrown during rendering.
   * This is a static method that can be implemented in a React class component.
   *
   * @function
   * @returns The new state object with the 'hasError' property set to true.
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  };

  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  };

  /**
   * Listen for error cancelation
   *
   * @function componentDidMount
   * @memberof Component
   * @returns
   */
  componentDidMount = () => {
    this.unReload = this.props.reloadSubject?.subscribe(() => {
      this.setState({
        hasError: false,
      });
    });
  }

  /**
   * Clears the garbage
   *
   * @function componentWillUnmount
   * @memberof Component
   * @returns
   */
  componentWillUnmount = () => {
    this.unHistory && this.unHistory();
    this.unReload && this.unReload();
  };

  /**
   * Listens for updates to the component and handles error state.
   *
   * @function componentDidUpdate
   * @memberof Component
   * @returns
   */
  componentDidUpdate = () => {
    if (this.state.hasError) {
      this.unHistory = this.props.history?.listen(() => {
        this.setState({
          hasError: false,
        });
        this.unHistory && this.unHistory();
      })
    }
  };

  /**
   * Handles error caught during rendering in React components.
   *
   * @param error - The error object that was caught.
   * @param errorInfo - Additional information about the error.
   * @memberof [ComponentName]
   */
  componentDidCatch = (error: any, errorInfo: any) => {
    this.props.onError && this.props.onError(error, errorInfo);
  };

  /**
   * A function that renders the children component.
   * If there is an error in the state, it will return null.
   * Otherwise, it will return the children component.
   * @returns The rendered component or null if there is an error in the state.
   */
  render = () => {
    if (this.state.hasError) {
      return null;
    } else {
      return this.props.children; 
    }
  };

};

export default ErrorBoundary;
