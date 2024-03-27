import * as React from "react";
import { useEffect, useState } from "react";

import { fileTypeFromBlob } from "file-type/core";

import LoaderView from "../../../components/LoaderView";

import useRenderWaiter from "../../../hooks/useRenderWaiter";
import useAsyncValue from "../../../hooks/useAsyncValue";

import { IOutletModalProps } from "../../../components/OutletView";

import cancelable, { CANCELED_SYMBOL } from "../../../utils/hof/cancelable";
import downloadBlob from "../utils/downloadBlob";

/**
 * Asynchronously fetches a file from a given URL by using XMLHttpRequest.
 *
 * @param url - The URL of the file to fetch.
 * @param onProgress - An optional callback function that will be called with the progress of the download.
 * @param sizeOriginal - An optional parameter specifying the original size of the file.
 * @returns - A Promise that resolves with the fetched Blob object or rejects with an error.
 */
const downloadXHR = cancelable(async (
  url: string,
  onProgress?: (progress: number) => void,
  sizeOriginal?: number
) => {
  console.log('useOpenDocument downloadXHR', {url});
  try {
    return await downloadBlob(url, {
      onProgress,
      sizeOriginal,
    });
  } catch (error) {
    console.log("useOpenDocument downloadXHR error", error);
    onProgress && onProgress(0);
    return null;
  }
});

/**
 * Asynchronously fetches a file from a given URL by using Fetch API.
 *
 * @param url - The URL of the file to fetch.
 * @param onProgress - An optional callback function that will be called with the progress of the download.
 * @returns - A Promise that resolves with the fetched Blob object or rejects with an error.
 */
const downloadFetch = cancelable(async (url: string, onProgress?: (progress: number) => void) => {
  console.log('useOpenDocument downloadFetch', {url});
  try {
    const response = await fetch(url, {
      method: 'GET',
      /**
       * Set of headers used for making HTTP requests.
       *
       * @typedef {Object} Headers
       * @property {string} Content-Type - The value of the Content-Type header.
       * @property {string} X-Requested-With - The value of the X-Requested-With header.
       * @property {string} Access-Control-Allow-Origin - The value of the Access-Control-Allow-Origin header.
       */
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Requested-With": "XMLHttpRequest",
        "Access-Control-Allow-Origin": "*"
      },
      mode: "no-cors",
    });
    if (!response.ok) {
      throw response;
    }
    const result = await response.blob();
    onProgress && onProgress(100);
    return result;
  } catch (error) {
    onProgress && onProgress(0);
    console.log("useOpenDocument downloadFetch error", error);
    return null;
  }
});

/**
 * Represents the main view component.
 *
 * @param props - The component props.
 * @param props.onChange - The onChange callback function.
 * @param props.history - The history object from react-router.
 * @param props.data - The data object.
 */
export const MainView = ({ onChange, history, data }: IOutletModalProps) => {
  const [progress, setProgress] = useState(0);

  const waitForChanges = useRenderWaiter([data], 10);

  useAsyncValue(async () => {
    try {
      let blob = await downloadXHR(data.url, setProgress, data.sizeOriginal);
      if (blob === CANCELED_SYMBOL) {
        return;
      }
      if (!blob) {
        blob = await downloadFetch(data.url, setProgress);
      }
      if (blob === CANCELED_SYMBOL) {
        return;
      }
      if (!blob) {
        console.log('useOpenDocument failed to fetch');
        history.replace("/error");
        return;
      }
      const blobType = await fileTypeFromBlob(blob);
      const mime = blobType?.mime || blob.type;
      const url = URL.createObjectURL(new Blob([blob], { type: mime }));
      onChange({
        ...data,
        blob,
        url,
        mime,
      });
      await waitForChanges();
      if (mime.startsWith("image/")) {
        history.replace("/image");
      } else if (mime.startsWith("audio/")) {
        history.replace("/audio");
      } else if (mime.startsWith("video/")) {
        history.replace("/video");
      } else if (mime.endsWith("/pdf")) {
        history.replace("/pdf");
      } else {
        history.replace("/file");
      }
    } catch (error) {
      console.error(error);
      history.replace("/error");
    }
  });

  useEffect(() => () => {
    downloadFetch.cancel();
    downloadXHR.cancel();
  }, []);

  return (
    <LoaderView
      variant={progress !== 0 && progress !== 100 ? "determinate" : "indeterminate"}
      value={progress !== 0 && progress !== 100 ? progress : undefined}
      size={48}
      sx={{ height: 275 }}
    />
  );
};

export default MainView;
