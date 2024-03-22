import * as React from "react";
import { useState, useRef, useLayoutEffect } from "react";

import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";

import DragDropView, { ACCEPT_DEFAULT } from "../DragDropView";
import ActionStopIcon from "../ActionStopIcon";
import LoaderView from "../LoaderView";
import ActionIcon from "../ActionIcon";
import Async from "../Async";

import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";

import useConfirm from "../../hooks/useConfirm";
import useActualValue from "../../hooks/useActualValue";
import useActualCallback from "../../hooks/useActualCallback";

import { SxProps } from "@mui/material";

export interface IFilesViewProps {
  items?: string[];
  disabled?: boolean;
  onUpload?: (file: File) => string | Promise<string>;
  onRemove?: (item: string) => void | Promise<void>;
  onChange?: (items: string[]) => void | Promise<void>;
  onClick?: (item: string) => void | Promise<void>;
  tr?: (item: string) => (string | Promise<string>);
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  accept?: string;
  multiple?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
}

const Loader = LoaderView.createLoader(24);

const CONFIRM_MESSAGE = "Are you sure you want to delete this file?";
const CONFIRM_TITLE = "Confirmation";

/**
 * A component for displaying a list of files with upload, remove, and click functionalities.
 *
 * @param items - The list of file names to display.
 * @param className - Additional CSS class names for the root element.
 * @param style - Additional inline styles for the root element.
 * @param sx - Additional theme styles for the root element.
 * @param disabled - Flag to disable the component.
 * @param onUpload - The callback function when a file is uploaded. It accepts the uploaded file as an argument and should return the name of the uploaded file.
 * @param onRemove - The callback function when a file is removed. It accepts the file name as an argument.
 * @param onChange - The callback function when the file list changes. It does not accept any arguments.
 * @param onClick - The callback function when a file is clicked. It accepts the file name as an argument.
 * @param tr - The translation function for translating labels. It accepts a label as an argument and should return the translated label.
 * @param accept - The file types that can be uploaded. Defaults to ACCEPT_DEFAULT.
 * @param multiple - Flag to allow multiple file uploads. Defaults to false.
 * @param onLoadStart - The callback function when file loading starts.
 * @param onLoadEnd - The callback function when file loading ends. It accepts a boolean flag indicating if the loading was successful or not.
 * @param fallback - The fallback function to handle errors. It accepts an Error object as an argument.
 * @param throwError - Flag to throw error instead of handling it with the fallback function.
 *
 * @returns The FilesView component.
 */
export const FilesView = ({
  items = [],
  className,
  style,
  sx,
  disabled: upperDisabled = false,
  onUpload = ({ name }) => name,
  onRemove = () => undefined,
  onChange = () => undefined,
  onClick = () => undefined,
  tr = (label) => label,
  accept = ACCEPT_DEFAULT,
  multiple = false,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError = false,
}: IFilesViewProps) => {
  const [loading, setLoading] = useState(0);

  const disabled = !!loading || upperDisabled;

  const pickConfirm = useConfirm({
    title: CONFIRM_TITLE,
    msg: CONFIRM_MESSAGE,
  });

  /**
   * Function that handles the load start event.
   *
   * @function handleLoadStart
   * @returns
   */
  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  /**
   * Decreases the loading count by 1 and calls the `onLoadEnd` function if it is not null.
   *
   * @param isOk - Indicates if the load operation is successful.
   */
  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => Math.max(loading - 1, 0));
    onLoadEnd && onLoadEnd(isOk);
  };

  const isMounted = useRef(true);

  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  const [uploads, setUploads] = useState<String[]>([]);

  const items$ = useActualValue(items);
  const onChange$ = useActualCallback(onChange);

  /**
   * Handles the removal of an item from a list.
   *
   * @param item - The item to be removed.
   * @returns - Resolves when the item has been removed successfully.
   * @throws {Error} - If an error occurs during the removal process and throwError is true.
   */
  const handleRemove = async (item: string) => {
    let isOk = true;
    try {
      handleLoadStart();
      await onRemove(item);
      await onChange$(items$.current.filter((it) => it !== item));
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      handleLoadEnd(isOk);
    }
  };

  /**
   * Asynchronously handles uploading multiple files.
   *
   * @param files - An array of files to upload.
   * @returns - A promise that resolves when all files are uploaded and handled.
   */
  const handleData = async (files: File[]) => {
    let isOk = true;
    try {
      handleLoadStart();
      for (const file of files) {
        const fileName = new String(file.name);
        isMounted.current &&
          setUploads((prevUploads) => [...prevUploads, fileName]);
        const docName = await onUpload(file);
        isMounted.current &&
          setUploads((prevUploads) =>
            prevUploads.filter((item) => item !== fileName)
          );
        await onChange$([...items$.current, docName]);
      }
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      handleLoadEnd(isOk);
    }
  };

  /**
   * Handles the click event.
   *
   * @param file - The file to be processed.
   * @returns - A promise that resolves when the click event is handled.
   */
  const handleClick = async (file: string) => {
    let isOk = true;
    try {
      handleLoadStart();
      await onClick(file);
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      handleLoadEnd(isOk);
    }
  };

  return (
    <Stack
      className={className}
      style={style}
      sx={sx}
      overflow="hidden"
      direction="column"
      alignItems="stretch"
      justifyContent="stretch"
    >
      <DragDropView
        disabled={disabled}
        accept={accept}
        multiple={multiple}
        onData={handleData}
      />
      <List dense disablePadding sx={{ mt: 1 }}>
        {uploads.map((item, idx) => (
          <ListItem
            disableGutters
            key={`${item}-${idx}`}
            secondaryAction={
              <ActionStopIcon disabled={disabled}>
                <ClearIcon />
              </ActionStopIcon>
            }
          >
            <ListItemButton>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        {items.map((item, idx) => (
          <ListItem
            disableGutters
            key={`${item}-${idx}`}
            secondaryAction={
              <ActionIcon
                disabled={disabled}
                onClick={() => new Promise((res, rej) => {
                  pickConfirm().then(async (isOk) => {
                    try {
                      if (isOk) {
                        await handleRemove(item);
                      }
                      res();
                    } catch (error) {
                      rej(error);
                    }
                  })
                })}
              >
                <DeleteIcon />
              </ActionIcon>
            }
          >
            <ListItemButton onClick={() => handleClick(item)}>
              <Async payload={item} Loader={Loader}>
                {async (item) => {
                  const label = await tr(item);
                  return <ListItemText primary={label} />
                }}
              </Async>
            </ListItemButton>
          </ListItem>
        ))}
        {!items.length && !loading && (
          <ListItem sx={{ pointerEvents: 'none' }}>
            <ListItemButton>
              <ListItemText primary="Nothing found" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Stack>
  );
};

export default FilesView;
