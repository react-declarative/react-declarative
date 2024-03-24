import * as React from "react";

/**
 * Interface for props of a component that should not be rendered on the server side.
 * @interface INoSsrProps
 */
interface INoSsrProps {
  ServerView?: React.ComponentType<any>;
  children?: React.ReactNode;
}

/**
 * Represents a state.
 * @interface State
 */
interface State {
  canRender: boolean;
}

const Fragment = () => <></>;

/**
 * Represents a component that handles server-side rendering (SSR) and client-side rendering (CSR) conditionally.
 */
export class NoSsr extends React.Component<INoSsrProps, State> {

  constructor(props: INoSsrProps) {
    super(props);
    this.state = {
      canRender: false,
    };
  };

  componentDidMount = () => {
    requestAnimationFrame(() => {
      this.setState({ canRender: true });
    });
  };

  /**
   * Renders the content based on the current state.
   *
   * @returns The rendered content.
   */
  render = () => {
    const { children, ServerView = Fragment } = this.props;
    const { canRender } = this.state;
    if (canRender) {
      return <>{children}</>;
    } else {
      return <ServerView />
    }
  };

};

export default NoSsr;
