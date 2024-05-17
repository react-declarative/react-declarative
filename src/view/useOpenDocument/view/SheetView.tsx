import * as React from 'react';
import { useEffect, useRef, useState } from "react";

import * as XLSX from "xlsx";

import Box from "@mui/material/Box";

import DownloadButton from "../components/DownloadButton";
import Sheet from '../../../components/Sheet';

import { IOutletModalProps } from '../../../components/OutletView';

/**
 * Renders an XLSX with a download button.
 *
 * @component
 * @param formState - The form state object.
 * @param formState.data.main.url - The URL of the video.
 * @param formState.data.main.fileName - The file name of the video.
 * @param [formState.data.main.placeholder] - The placeholder text for the video.
 * @param [formState.data.main.mime] - The MIME type of the video.
 * @returns The rendered PdfView component.
 */
export const SheetView = ({ formState, history }: IOutletModalProps) => {

  const [aoa, setAoa] = useState<string[][]>([]);
  const errorRef = useRef(false);

  useEffect(
    () => () => {
      if (!errorRef.current) {
        URL.revokeObjectURL(formState.data.main.url);
      }
    },
    [],
  );

  useEffect(() => {
    const process = async () => {
      try {
        const workbook = XLSX.read(await formState.data.main.blob.arrayBuffer(), { 
          type: 'binary',
        });
        const sheetName = workbook.SheetNames[0]; 
        const worksheet = workbook.Sheets[sheetName];
        const aoo = XLSX.utils.sheet_to_json<object>(worksheet, { header: 1 });
        const aoa = aoo.map(Object.values);
        setAoa(aoa);
      } catch {
        errorRef.current = true;
        history.replace("/file");
      }
    };
    process();
  }, []);

  return (
    <Box mt={1} mb={2}>
      <Sheet
        withFullScreen
        data={aoa}
        sx={{ height: 275, width: "100%" }}
      />
      <DownloadButton
        primary={formState.data.main.fileName}
        secondary={formState.data.main.placeholder || formState.data.main.mime}
      />
    </Box>
  );
};

export default SheetView;
