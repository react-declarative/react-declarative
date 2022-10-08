import * as React from 'react'

import { BrowserHistory, HashHistory, MemoryHistory } from 'history';

interface IErrorBoundaryProps {
  onError?: (error: Error, errorInfo: any) => void;
  history: MemoryHistory | BrowserHistory | HashHistory;
  children?: React.ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {

  static getDerivedStateFromError() {
    return { hasError: true };
  };

  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  };

  componentDidUpdate = () => {
    if (this.state.hasError) {
      const unsubscribe = this.props.history.listen(() => {
        this.setState({
          hasError: false,
        });
        unsubscribe();
      })
    }
  };

  componentDidCatch = (error: any, errorInfo: any) => {
    this.props.onError && this.props.onError(error, errorInfo);
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
