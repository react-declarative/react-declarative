import * as React from "react";

import TSubject from "../../model/TSubject";

/**
 * Represents the properties for the SubjectBinding component.
 */
interface ISubjectBindingProps {
  target?: TSubject<any>;
  children: React.ReactNode;
}

type Function = () => void;

/**
 * A React component that binds to a subject and updates when the subject emits a value.
 *
 * @extends React.Component
 */
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
