import * as React from "react";
import { useState } from "react";

import ModalDialog from "../ModalDialog";
import One from "../../One";

import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";

import useActualValue from "../../../hooks/useActualValue";
import useRenderWaiter from "../../../hooks/useRenderWaiter";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";
import IOneProps, { OneHandler } from "../../../model/IOneProps";
import IOnePublicProps from "../../../model/IOnePublicProps";

import sleep from "../../../utils/sleep";

/**
 * Interface for the props of the OnePicker component.
 *
 * @template Data - The type of the data.
 * @template Payload - The type of the payload.
 * @interface IOnePickerProps
 */
interface IOnePickerProps<Data = IAnything, Payload = IAnything> {
  waitForChangesDelay?: number;
  large?: boolean;
  onChange: (data: Data | null) => void;
  handler?: OneHandler<Data, Payload>;
  canCancel?: boolean;
  isBaseline?: IOneProps<Data, Payload>["isBaseline"];
  isBaselineForRoot?: IOneProps<Data, Payload>["isBaselineForRoot"];
  payload?: IOneProps<Data, Payload>["payload"];
  readTransform?: IOnePublicProps<Data, Payload>["readTransform"];
  writeTransform?: IOnePublicProps<Data, Payload>["writeTransform"];
  features?: IOnePublicProps<Data, Payload>["features"];
  title?: string;
  fields: IField[];
  open?: boolean;
}

const WAIT_FOR_CHANGES_DELAY = 1_000;

/**
 * OnePicker is a component that allows the user to select a single item from a list.
 *
 * @template Data - The data type for the selected item.
 * @template Payload - The data type for the payload passed to the onChange event handler.
 *
 * @param props - The component props.
 * @param [props.waitForChangesDelay=WAIT_FOR_CHANGES_DELAY] - The delay in milliseconds to wait for changes before calling the onChange event handler.
 * @param [props.onChange=(data: Data | null) => console.log({ data })] - The event handler called when the selected item changes.
 * @param props.fields - The list of fields to be displayed for each item in the OnePicker.
 * @param props.handler - The optional handler for customizing the behavior of the OnePicker.
 * @param props.payload - The optional payload to be passed to the onChange event handler.
 * @param props.features - The optional list of features to be applied to the OnePicker.
 * @param props.large - Whether to display the OnePicker in a large size or not.
 * @param props.title - The optional title to be displayed above the OnePicker.
 * @param [props.open=true] - Whether the OnePicker should be displayed as open or not.
 */
export const OnePicker = <
  Data extends IAnything = IAnything,
  Payload = IAnything
>({
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  onChange = (data: Data | null) => console.log({ data }),
  fields,
  handler,
  payload,
  canCancel = true,
  features,
  large,
  title,
  isBaseline,
  isBaselineForRoot,
  readTransform,
  writeTransform,
  open = true,
}: IOnePickerProps<Data, Payload>) => {
  const [data, setData] = useState<Data | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const data$ = useActualValue(data);

  const waitForRender = useRenderWaiter([data], 10);

  /**
   * Waits for changes to occur by asynchronously waiting for the completion of either
   * the `waitForRender` function or a `sleep` function with the provided `waitForChangesDelay`.
   *
   * @returns A promise that resolves when either the `waitForRender` function or the `sleep` function completes.
   */
  const waitForChanges = async () => {
    await Promise.race([waitForRender(), sleep(waitForChangesDelay)]);
  };

  /**
   * Handle change function.
   *
   * @param data - The new data to be handled.
   * @returns
   */
  const handleChange = (data: Data) => {
    setData(data);
    setInvalid(false);
  };
  
  /**
   * Callback function to handle invalid state.
   * Sets the `invalid` state to `true`.
   *
   * @function
   * @name handleInvalid
   * @returns
   */
  const handleInvalid = () => setInvalid(true);

  /**
   * Function to handle dismiss action.
   *
   * @function
   * @name handleDismiss
   * @returns
   */
  const handleDismiss = () => onChange(null);

  /**
   * Handles an accept event.
   *
   * @async
   * @function handleAccept
   * @returns - A Promise that resolves to undefined.
   */
  const handleAccept = async () => {
    setDisabled(true);
    try {
      await waitForChanges();
      onChange(data$.current);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <ModalDialog
      open={open}
      disabled={disabled}
      canCancel={canCancel}
      invalid={!data || invalid}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
    >
      {!!title && (
        <DialogTitle>
          <Box mr={3}>{title}</Box>
        </DialogTitle>
      )}
      <Box
        sx={{
          width: large ? "100vw" : "unset",
          maxWidth: large ? "100%" : "unset",
        }}
        p={3}
      >
        <One
          change={handleChange}
          invalidity={handleInvalid}
          readTransform={readTransform}
          writeTransform={writeTransform}
          isBaseline={isBaseline}
          isBaselineForRoot={isBaselineForRoot}
          handler={handler}
          payload={payload}
          fields={fields}
          features={features}
        />
      </Box>
    </ModalDialog>
  );
};

export default OnePicker;
