import * as React from "react";
import * as ReactDOM from "react-dom";

interface IPortalViewProps {
  children: React.ReactNode;
}

export class PortalView extends React.Component<IPortalViewProps> {

  element: HTMLDivElement | null = null;

  componentWillUnmount() {
    if (this.element) {
      document.body.removeChild(this.element);
    }
    this.element = null;
  };

  render() {
    if (!this.element) {
      this.element = document.createElement('div');
      document.body.appendChild(this.element);
    }
    return ReactDOM.createPortal(
      this.props.children,
      this.element
    );
  };

};

export default PortalView;
