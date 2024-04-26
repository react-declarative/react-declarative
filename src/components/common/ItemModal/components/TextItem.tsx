import * as React from 'react';

import ListItemText from "@mui/material/ListItemText";

import { ITile } from "../../../Tile";

export const TextItem = ({
    data: { label },
}: ITile<{label: string;}>) => (
    <ListItemText primary={label} />
);

export default TextItem;
