import * as React from 'react';
import { useCallback } from "react";
import { createMemoryHistory } from "history";

import IconButton from "@mui/material/IconButton";

import MainView from "./view/MainView";
import FileView from "./view/FileView";
import ImageView from "./view/ImageView";
import VideoView from "./view/VideoView";
import AudioView from "./view/AudioView";
import ErrorView from "./view/ErrorView";

import useActualRef from "../../hooks/useActualRef";
import { useOutletModal } from "../../components/OutletView";

import parseRouteUrl from "../../utils/parseRouteUrl";

import { IOutletModal } from "../../components/OutletView";

import Close from "@mui/icons-material/Close";

/**
 * Represents the interface for the parameters of a useOpenDocument hook.
 *
 * @interface IParams
 */
interface IParams {
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (error: Error) => void;
  onMount?: () => void;
  onUnmount?: () => void;
  onClose?: () => void;
  title?: string;
  submitLabel?: string;
  onSubmit?: (
    url: string,
    data: { main: { blob: Blob | null; mime: string; fileName: string; } } | null,
  ) => boolean | Promise<boolean>;
}

/**
 * Represents a request object for fetching a file from a URL for useOpenDocument hook.
 * @interface
 */
interface IRequest {
  url: string;
  fileName: string;
  placeholder?: string;
}

const routes: IOutletModal[] = [
  {
    id: "main",
    element: MainView,
    isActive: (url) => !!parseRouteUrl("/", url),
  },
  {
    id: "file",
    element: FileView,
    isActive: (url) => !!parseRouteUrl("/file", url),
  },
  {
    id: "image",
    element: ImageView,
    isActive: (url) => !!parseRouteUrl("/image", url),
  },
  {
    id: "video",
    element: VideoView,
    isActive: (url) => !!parseRouteUrl("/video", url),
  },
  {
    id: "audio",
    element: AudioView,
    isActive: (url) => !!parseRouteUrl("/audio", url),
  },
  {
    id: "error",
    element: ErrorView,
    isActive: (url) => !!parseRouteUrl("/error", url),
  },
];

const history = createMemoryHistory();

/**
 * A hook which allows displaying and interacting with a document preview.
 *
 * @param options - An optional object containing the following parameters:
 *   @param [options.onLoadStart] - The callback function to be executed when the document starts loading.
 *   @param [options.onLoadEnd] - The callback function to be executed when the document finishes loading.
 *   @param [options.fallback] - The fallback content to be displayed while the document is loading.
 *   @param [options.onMount] - The callback function to be executed when the component is mounted.
 *   @param [options.onUnmount] - The callback function to be executed when the component is unmounted.
 *   @param [options.onSubmit] - The callback function to be executed when the submit button is clicked.
 *   @param [options.onClose] - The callback function to be executed when the component is closed.
 *   @param [options.title="Document preview"] - The title of the component.
 *   @param [options.submitLabel="Download"] - The label of the submit button.
 *
 * @returns - An object containing the following properties:
 *   @returns render - The render function for rendering the document preview component.
 *   @returns pickData - A function to pick the data for displaying the document preview.
 */
export const useOpenDocument = ({
  onLoadStart,
  onLoadEnd,
  fallback,
  onMount,
  onUnmount,
  onSubmit,
  onClose,
  title = "Document preview",
  submitLabel = "Download",
}: IParams = {}) => {
  const [params, setParams] = useActualRef<IRequest | null>(null);
  const { render, pickData } = useOutletModal({
    title,
    AfterTitle: ({ onClose }) => (
      <IconButton size="small" onClick={onClose}>
        <Close />
      </IconButton>
    ),
    withActionButton: true,
    withStaticAction: false,
    onSubmit,
    onLoadStart,
    onLoadEnd,
    fallback,
    onMount,
    onUnmount: () => {
      setParams(null);
      onUnmount && onUnmount();
    },
    onClose,
    submitLabel,
    routes,
    history,
    fullScreen: false,
    mapInitialData: () => ({
      main: {
        blob: null as never,
        mime: null as never,
        ...params.current!,
      },
    }),
  });
  return {
    render,
    pickData: useCallback((request: IRequest) => {
      setParams(request);
      history.push("/");
      pickData(request.url);
    }, []),
  };
};

export default useOpenDocument;
