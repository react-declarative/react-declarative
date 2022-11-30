import * as React from "react";
import * as ReactDOM from "react-dom";

interface IPortalViewProps {
  children: React.ReactNode;
  selector?: string;
}

export class PortalView extends React.Component<IPortalViewProps> {

  static defaultProps = {
    selector: '#modal-root'
  };

  modalRoot?: HTMLElement;
  element = document.createDocumentFragment();

  private initModalRoot = () => {
    const modalRoot = document.querySelector<HTMLElement>(this.props.selector!);
    if (modalRoot) {
      this.modalRoot = modalRoot;
    } else {
      throw new Error(`react-declarative PortalView ${this.props.selector} not found`);
    }
  };

  constructor(props: IPortalViewProps) {
    super(props);
    this.initModalRoot();
  };

  componentDidMount = () => {
    this.modalRoot!.appendChild(this.element);
  };

  componentWillUnmount = () => {
    this.modalRoot!.removeChild(this.element);
  };

  render = () => {
    return ReactDOM.createPortal(
      this.props.children,
      this.element
    );
  };

};

export default PortalView;
