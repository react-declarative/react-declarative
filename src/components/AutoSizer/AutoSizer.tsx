import * as React from "react";

import createDetectElementResize from "./detectElementResize";

import ISize from "../../model/ISize";

export interface IChildParams<T extends any = unknown> extends ISize {
  payload: T;
}

export interface IAutoSizerProps<T extends any = unknown> {
  children: (s: IChildParams<T>) => any;
  className?: string;
  defaultHeight?: number;
  defaultWidth?: number;
  withContainerHeight?: boolean;
  withContainerWidth?: boolean;
  heightRequest?: (h: number) => number;
  widthRequest?: (w: number) => number;
  onResize?: (s: ISize) => void;
  style?: React.CSSProperties;
  payload?: T;
  target?: HTMLElement;
  closest?: string;
  selector?: string;
}

type State = {
  height: number,
  width: number,
};

type ResizeHandler = (element: HTMLElement, onResize: () => void) => void;

type DetectElementResize = {
  addResizeListener: ResizeHandler,
  removeResizeListener: ResizeHandler,
};

export class AutoSizer<T extends unknown = object> extends React.Component<IAutoSizerProps<T>, State> {
  static defaultProps: Partial<IAutoSizerProps<any>> = {
    onResize: () => {},
    heightRequest: (h) => h,
    widthRequest: (w) => w,
    withContainerHeight: false,
    withContainerWidth: false,
    style: {},
  };

  state = {
    height: this.props.defaultHeight || 0,
    width: this.props.defaultWidth || 0,
  };

  _parentNode?: HTMLElement;
  _autoSizer?: HTMLElement | null;
  _detectElementResize?: DetectElementResize;

  shouldComponentUpdate(nextProps: IAutoSizerProps<T>, nextState: State) {
    if (this.state !== nextState) {
      return true;
    } else {
      let isUpdatePending = false;
      isUpdatePending = isUpdatePending || nextProps.className !== this.props.className;
      isUpdatePending = isUpdatePending || nextProps.withContainerHeight !== this.props.withContainerHeight;
      isUpdatePending = isUpdatePending || nextProps.withContainerWidth !== this.props.withContainerWidth;
      isUpdatePending = isUpdatePending || nextProps.style !== this.props.style;
      isUpdatePending = isUpdatePending || nextProps.payload !== this.props.payload;
      return isUpdatePending;
    }
  };

  componentDidMount() {

    let element = this.props.target || this._autoSizer;

    if (this.props.closest) {
      element = element?.closest(this.props.closest) || null;
    }

    if (this.props.selector) {
      element = element?.querySelector(this.props.selector) || null;
    }

    if (
      element &&
      element.parentNode &&
      element.parentNode.ownerDocument &&
      element.parentNode.ownerDocument.defaultView &&
      element.parentNode instanceof
        element.parentNode.ownerDocument.defaultView.HTMLElement
    ) {
      this._parentNode = element.parentNode;

      this._detectElementResize = createDetectElementResize();
      this._detectElementResize.addResizeListener(
        this._parentNode,
        this._onResize
      );

      this._onResize();
    }
  }

  componentWillUnmount() {
    if (this._detectElementResize && this._parentNode) {
      this._detectElementResize.removeResizeListener(
        this._parentNode,
        this._onResize
      );
    }
  }

  render() {
    const {
      children,
      className,
      withContainerHeight,
      withContainerWidth,
      style,
    } = this.props;
    const { height, width } = this.state;

    const outerStyle: React.CSSProperties = { overflow: 'visible' };
    const childParams: Partial<IChildParams<T>> = { payload: this.props.payload };

    let bailoutOnChildren = false;

    if (height === 0) {
      bailoutOnChildren = true;
    }
    if (withContainerHeight) {
      outerStyle.height = height;
    }
    childParams.height = this.props.heightRequest!(height);

    if (width === 0) {
      bailoutOnChildren = true;
    }
    if (withContainerWidth) {
      outerStyle.width = width;
    }
    childParams.width = this.props.widthRequest!(width);

    return (
      <div
        className={className}
        ref={this._setRef}
        style={{
          ...outerStyle,
          ...style,
        }}
      >
        {!bailoutOnChildren && children(childParams as IChildParams<T>)}
      </div>
    );
  }

  _onResize = () => {
    const { onResize } = this.props;

    if (this._parentNode) {

      const height = this._parentNode.offsetHeight || 0;
      const width = this._parentNode.offsetWidth || 0;

      const style = window.getComputedStyle(this._parentNode) || {};
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
      const paddingRight = parseInt(style.paddingRight, 10) || 0;
      const paddingTop = parseInt(style.paddingTop, 10) || 0;
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0;

      const newHeight = height - paddingTop - paddingBottom;
      const newWidth = width - paddingLeft - paddingRight;

      if (this.state.height !== newHeight || this.state.width !== newWidth) {
        this.setState({
          height: height - paddingTop - paddingBottom,
          width: width - paddingLeft - paddingRight,
        });
        onResize!({ height, width });
      }
    }
  };

  _setRef = (autoSizer: HTMLElement | null) => {
    this._autoSizer = autoSizer;
  }

}

export default AutoSizer;
