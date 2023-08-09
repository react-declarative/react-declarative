import * as React from "react";

interface INoSsrProps {
  ServerView?: React.ComponentType<any>;
  children?: React.ReactNode;
}

interface State {
  canRender: boolean;
}

const Fragment = () => <></>;

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
