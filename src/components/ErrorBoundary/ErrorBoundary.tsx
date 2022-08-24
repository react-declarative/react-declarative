import * as React from 'react'

interface IErrorBoundaryProps {
    onError?: (error: Error, errorInfo: any) => void;
    children?: React.ReactChild;
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps> {
    componentDidCatch(error: any, errorInfo: any) {
      this.props.onError && this.props.onError(error, errorInfo);
    }
    render() {
      return this.props.children; 
    };
};

export default ErrorBoundary;
