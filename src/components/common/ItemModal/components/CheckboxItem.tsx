import * as React from 'react';

import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';

import { ITile } from "../../../Tile";

export const CheckboxItem = ({
    data: { label },
    isSelected,
}: ITile<{label: string;}>) => (
    <>
        <ListItemIcon>
            <Checkbox
                edge="start"
                checked={isSelected}
                tabIndex={-1}
                disableRipple
            />
        </ListItemIcon>
        <ListItemText primary={label} />
    </>
);

export default CheckboxItem;
