import * as React from 'react'

import { BrowserHistory, HashHistory, MemoryHistory } from 'history';

import createWindowHistory from '../../utils/createWindowHistory';

interface IErrorBoundaryProps {
  onError?: (error: Error, errorInfo: any) => void;
  history?: MemoryHistory | BrowserHistory | HashHistory;
  children?: React.ReactChild;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  static defaultProps: Partial<IErrorBoundaryProps> = {
    history: createWindowHistory(),
  };
  private unsubscribe?: Function;
  private historyRef?: IErrorBoundaryProps['history'];
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  };
  componentDidUpdate = () => {
    if (this.historyRef !== this.props.history) {
      this.unsubscribe && this.unsubscribe();
      this.unsubscribe = this.props.history!.listen(() => this.setState({
        hasError: false,
      }));
    }
    this.historyRef = this.props.history;
  };
  componentDidMount = () => {
    this.unsubscribe = this.props.history!.listen(() => this.setState({
      hasError: false,
    }));
    this.historyRef = this.props.history;
  };
  componentDidUnmount = () => {
    this.unsubscribe && this.unsubscribe();
    this.unsubscribe = undefined;
    this.historyRef = undefined;
  };
  componentDidCatch = (error: any, errorInfo: any) => {
    this.props.onError && this.props.onError(error, errorInfo);
    this.setState({ hasError: true });
  };
  render = () => {
    if (this.state.hasError) {
      return null;
    } else {
      return this.props.children; 
    }
  };
};

export default ErrorBoundary;
