import * as React from "react";

import createDetectElementResize from "./detectElementResize";

import deepCompare from "../../utils/deepCompare";

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
  height: number;
  width: number;
  childHeight: number;
  childWidth: number;
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

  lastHeightRequest = this.props.heightRequest!;
  lastWidthRequest = this.props.widthRequest!;

  private _patchSizeRequest = (nextProps: IAutoSizerProps<T>) => {
    if (nextProps.heightRequest) {
      this.lastHeightRequest = nextProps.heightRequest;
    }
    if (nextProps.widthRequest) {
      this.lastWidthRequest = nextProps.widthRequest;
    }
  };

  state = {
    height: this.props.defaultHeight || 0,
    width: this.props.defaultWidth || 0,
    childHeight: this.props.defaultHeight || 0,
    childWidth: this.props.defaultWidth || 0,
  };

  _parentNode?: HTMLElement;
  _autoSizer?: HTMLElement | null;
  _detectElementResize?: DetectElementResize;

  shouldComponentUpdate(nextProps: IAutoSizerProps<T>, nextState: State) {
    this._patchSizeRequest(nextProps);
    let isStateChanged = false;
    isStateChanged = isStateChanged || this.state.height !== nextState.height;
    isStateChanged = isStateChanged || this.state.width !== nextState.width;
    isStateChanged = isStateChanged || this.state.childHeight !== nextState.childHeight;
    isStateChanged = isStateChanged || this.state.childWidth !== nextState.childWidth;
    if (isStateChanged) {
      return true;
    } else {
      let isUpdatePending = false;
      isUpdatePending = isUpdatePending || nextProps.className !== this.props.className;
      isUpdatePending = isUpdatePending || nextProps.withContainerHeight !== this.props.withContainerHeight;
      isUpdatePending = isUpdatePending || nextProps.withContainerWidth !== this.props.withContainerWidth;
      isUpdatePending = isUpdatePending || !deepCompare(nextProps.style, this.props.style);
      isUpdatePending = isUpdatePending || nextProps.payload !== this.props.payload;
      return isUpdatePending;
    }
  }

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
    const { height, width, childHeight, childWidth } = this.state;

    const outerStyle: React.CSSProperties = { overflow: 'visible' };
    const childParams: Partial<IChildParams<T>> = { payload: this.props.payload };

    if (withContainerHeight) {
      outerStyle.height = height;
    }
    childParams.height = childHeight;

    if (withContainerWidth) {
      outerStyle.width = width;
    }
    childParams.width = childWidth;

    return (
      <div
        className={className}
        ref={this._setRef}
        style={{
          ...outerStyle,
          ...style,
        }}
      >
        {children(childParams as IChildParams<T>)}
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

      const pendingHeight = height - paddingTop - paddingBottom;
      const pendingWidth = width - paddingLeft - paddingRight;
      const childHeight = this.lastHeightRequest(pendingHeight);
      const childWidth = this.lastWidthRequest(pendingWidth);

      let isStateChanged = false;
      isStateChanged = isStateChanged || this.state.height !== pendingHeight;
      isStateChanged = isStateChanged || this.state.width !== pendingWidth;
      isStateChanged = isStateChanged || this.state.childHeight !== childHeight;
      isStateChanged = isStateChanged || this.state.childWidth !== childWidth;

      if (isStateChanged) {
        this.setState({
          height: pendingHeight,
          width: pendingWidth,
          childHeight,
          childWidth,
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
