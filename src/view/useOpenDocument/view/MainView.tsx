import * as React from 'react';

import { fileTypeFromBlob } from "file-type/core";

import LoaderView from '../../../components/LoaderView';

import useRenderWaiter from '../../../hooks/useRenderWaiter';
import useAsyncValue from '../../../hooks/useAsyncValue';

import { IOutletModalProps } from '../../../components/OutletView';

/**
 * Represents the main view component.
 *
 * @param props - The component props.
 * @param props.onChange - The onChange callback function.
 * @param props.history - The history object from react-router.
 * @param props.data - The data object.
 */
export const MainView = ({ onChange, history, data }: IOutletModalProps) => {
  const waitForChanges = useRenderWaiter([data], 10);

  useAsyncValue(async () => {
    try {
      const response = await fetch(data.url);
      const blob = await response.blob();
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
      } else {
        history.replace("/file");
      }
    } catch (error) {
      console.error(error);
      history.replace("/error");
    }
  });

  return <LoaderView size={48} sx={{ height: 275 }} />;
};

export default MainView;
