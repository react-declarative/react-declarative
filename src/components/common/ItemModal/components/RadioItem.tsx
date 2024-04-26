import * as React from 'react';

import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from '@mui/material/ListItemIcon';
import Radio from '@mui/material/Radio';

import { ITile } from "../../../Tile";

export const RadioItem = ({
    data: { label },
    isSelected,
}: ITile<{label: string;}>) => (
    <>
        <ListItemIcon>
            <Radio
                edge="start"
                checked={isSelected}
                tabIndex={-1}
                disableRipple
            />
        </ListItemIcon>
        <ListItemText primary={label} />
    </>
);

export default RadioItem;
