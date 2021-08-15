import * as React from 'react';

import MatTypography from "@material-ui/core/Typography";

import { ITypographySlot } from '../../../slots/TypographySlot';

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
