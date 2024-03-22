import * as React from "react";

import createDetectElementResize from "./detectElementResize";

import deepCompare from "../../utils/deepCompare";

import ISize from "../../model/ISize";

/**
 * The `IChildParams` interface defines the parameters for creating a child element.
 * It extends the `ISize` interface and allows specifying an optional payload of type `T`.
 *
 * @template T - The type of the payload.
 */
export interface IChildParams<T extends any = unknown> extends ISize {
  payload?: T;
}

/**
 * Represents the properties for the AutoSizer component.
 * @template T - The type of the payload.
 */
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

/**
 * Represents the state of an element.
 * @typedef {Object} State
 * @property {number} height - The height of the element.
 * @property {number} width - The width of the element.
 * @property {number} childHeight - The height of the child element.
 * @property {number} childWidth - The width of the child element.
 */
type State = {
  height: number;
  width: number;
  childHeight: number;
  childWidth: number;
};

/**
 * ResizeHandler is a function that can be used to handle resizing of an HTML element.
 *
 * @param {HTMLElement} element - The HTML element to be resized.
 * @param {function} onResize - The callback function to be called when resize occurs.
 * @return {void}
 */
type ResizeHandler = (element: HTMLElement, onResize: () => void) => void;

/**
 * DetectElementResize is a class that provides methods for adding and removing
 * resize listeners to an element.
 *
 * @typedef {function(Element, ResizeCallback): void} ResizeHandler
 * @param {Element} element - The element to which the resize listener will be added or removed.
 * @param {ResizeCallback} callback - The callback function to be called when the element is resized.
 * @callback ResizeCallback
 * @param {Element} element - The element that has been resized.
 *
 * @typedef {object} DetectElementResize
 * @property {ResizeHandler} addResizeListener - Adds a resize listener to the specified element.
 * @property {ResizeHandler} removeResizeListener - Removes the resize listener from the specified element.
 */
type DetectElementResize = {
  addResizeListener: ResizeHandler,
  removeResizeListener: ResizeHandler,
};

/**
 * A component that automatically resizes its children based on its parent element's size.
 */
export class AutoSizer<T extends unknown = object> extends React.Component<IAutoSizerProps<T>, State> {

  /**
   * Default properties for the AutoSizer component.
   *
   * @type {Partial<IAutoSizerProps<any>>}
   */
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

  /**
   * Updates the last height and width request values based on the provided nextProps object.
   *
   * @param nextProps - The next props object containing heightRequest and widthRequest values.
   * @returns
   */
  private _patchSizeRequest = (nextProps: IAutoSizerProps<T>) => {
    if (nextProps.heightRequest) {
      this.lastHeightRequest = nextProps.heightRequest;
    }
    if (nextProps.widthRequest) {
      this.lastWidthRequest = nextProps.widthRequest;
    }
  };

  /**
   * Represents the state of a component.
   *
   * @typedef {object} State
   * @property {number} height - The height of the component. Defaults to 0 if not provided.
   * @property {number} width - The width of the component. Defaults to 0 if not provided.
   * @property {number} childHeight - The height of the child component. Defaults to 0 if not provided.
   * @property {number} childWidth - The width of the child component. Defaults to 0 if not provided.
   */
  state = {
    height: this.props.defaultHeight || 0,
    width: this.props.defaultWidth || 0,
    childHeight: this.props.defaultHeight || 0,
    childWidth: this.props.defaultWidth || 0,
  };

  _parentNode?: HTMLElement;
  _autoSizer?: HTMLElement | null;
  _detectElementResize?: DetectElementResize;

  /**
   * Determines whether the component should update based on the changes in the nextProps and nextState.
   *
   * @param nextProps - The next props that will be received by the component.
   * @param nextState - The next state that will be set in the component.
   * @returns - Returns true if the component should update, otherwise false.
   */
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

  /**
   * Executes after the component has been mounted to the DOM.
   * It sets up the element for resizing and calls the resize event handler.
   *
   * @return
   */
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

  /**
   * This method is invoked immediately before a component is unmounted and destroyed.
   *
   * It removes the resize listener if it exists and the parent node is defined.
   */
  componentWillUnmount() {
    if (this._detectElementResize && this._parentNode) {
      this._detectElementResize.removeResizeListener(
        this._parentNode,
        this._onResize
      );
    }
  }

  /**
   * Renders a container div with specified child parameters and styles.
   * @function
   * @returns - The rendered container div element.
   */
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

  /**
   * Function that handles the resize event.
   *
   * @function _onResize
   * @private
   * @returns
   */
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

  /**
   * Sets the reference to the autoSizer element.
   *
   * @param autoSizer - The autoSizer element or null.
   * @returns
   */
  _setRef = (autoSizer: HTMLElement | null) => {
    this._autoSizer = autoSizer;
  }

}

export default AutoSizer;
