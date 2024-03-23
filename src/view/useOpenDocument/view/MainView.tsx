import * as React from "react";
import { useState } from "react";

import { fileTypeFromBlob } from "file-type/core";

import LoaderView from "../../../components/LoaderView";

import useRenderWaiter from "../../../hooks/useRenderWaiter";
import useAsyncValue from "../../../hooks/useAsyncValue";

import { IOutletModalProps } from "../../../components/OutletView";
import downloadBlob from "../utils/downloadBlob";

/**
 * Asynchronously fetches a file from a given URL.
 *
 * @param url - The URL of the file to fetch.
 * @param onProgress - An optional callback function that will be called with the progress of the download.
 * @param sizeOriginal - An optional parameter specifying the original size of the file.
 * @returns - A Promise that resolves with the fetched Blob object or rejects with an error.
 */
const fetchFile = async (
  url: string,
  onProgress?: (progress: number) => void,
  sizeOriginal?: number
) => {
  try {
    return await downloadBlob(url, {
      onProgress,
      sizeOriginal,
    });
  } catch (error) {
    console.log("fetchFile downloadBlob error", error);
    const response = await fetch(url, {
      mode: "no-cors",
    });
    return await response.blob();
  }
};

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
      const blob = await fetchFile(data.url, setProgress, data.sizeOriginal);
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

  return (
    <LoaderView
      variant={progress ? "determinate" : "indeterminate"}
      value={progress || undefined}
      size={48}
      sx={{ height: 275 }}
    />
  );
};

export default MainView;
