import * as React from 'react';

import MatTypography from "@mui/material/Typography";

import { ITypographySlot } from '../../../slots/TypographySlot';

/**
 * Typography component.
 *
 * @typedef  ITypographySlot
 * @property value - The text value to be displayed.
 * @property placeholder - The placeholder text to be displayed if `value` is empty.
 * @property typoVariant - The variant of the typography component (default: 'body1').
 * @property  style - Additional style to be applied to the typography component.
 *
 * @param props - The props for the Typography component.
 * @returns The rendered Typography component.
 */
export const Typography = ({
    value = '',
    placeholder = '',
    typoVariant = 'body1',
    style,
}: ITypographySlot) => (
    <MatTypography variant={typoVariant} style={style}>
        {value || placeholder}
    </MatTypography>
);

export default Typography;
