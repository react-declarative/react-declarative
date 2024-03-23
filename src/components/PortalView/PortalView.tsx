import * as React from "react";
import * as ReactDOM from "react-dom";

/**
 * Represents the properties for the PortalView component.
 */
interface IPortalViewProps {
  children: React.ReactNode;
}

/**
 * Represents a portal view component.
 * @class
 */
export class PortalView extends React.Component<IPortalViewProps> {

  element: HTMLDivElement | null = null;

  /**
   * Method componentWillUnmount
   *
   * This method is called when the component is about to be unmounted (removed) from the DOM.
   * It performs clean-up tasks, if any, to avoid memory leaks or unwanted effects after the component is removed.
   *
   * This method checks if 'this.element' (assumed to be a DOM element) exists, and if so,
   * removes it from the document body using 'document.body.removeChild()'.
   * Finally, it sets 'this.element' to null to release any references to the removed element.
   *
   * @return
   */
  componentWillUnmount() {
    if (this.element) {
      document.body.removeChild(this.element);
    }
    this.element = null;
  };

  /**
   * Renders the provided children into a portal, within a dynamically created div element appended to the document body.
   *
   * @return - The resulting React element after rendering the children into the portal.
   */
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
