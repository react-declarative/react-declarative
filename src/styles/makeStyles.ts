import { makeStyles as makeMuiStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

import { StyleRulesCallback, StyleRules } from "@mui/styles";

type Props = {};

export const makeStyles = (cb: StyleRules<Props> | StyleRulesCallback<Theme, Props>) =>
    makeMuiStyles((theme: Theme) => typeof cb === 'function' ? cb(theme) : cb);

export default makeStyles;
