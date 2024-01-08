import * as React from "react";

import TSubject from "../../model/TSubject";

interface ISubjectBindingProps {
  target?: TSubject<any>;
  children: React.ReactNode;
}

type Function = () => void;

export class SubjectBinding extends React.Component<ISubjectBindingProps> {
  private unsubscribe?: Function;

  componentDidMount = () => {
    this.unsubscribe = this.props.target?.subscribe(() => {
      this.forceUpdate();
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe && this.unsubscribe();
  };

  render = () => <>{this.props.children}</>;
}

export default SubjectBinding;
