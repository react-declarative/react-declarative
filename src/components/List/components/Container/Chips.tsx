import * as React from 'react';

import { makeStyles } from '../../../../styles';
import { alpha } from '@mui/material';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import ScrollView from '../../../common/ScrollView';

import IListProps from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import useChips from '../../hooks/useChips';

interface IChipsProps<RowData extends IRowData = IAnything> {
    listChips: IListProps<RowData>['chips'];
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: 48,
        width: '100%',
        background: alpha(
            theme.palette.getContrastText(theme.palette.background.paper),
            0.05
        ),
    }
}));

export const Chips = <RowData extends IRowData = IAnything>({
    listChips = [],
}: IChipsProps<RowData>) => {

    const classes = useStyles();

    const { chips, setChips } = useChips();

    const createToggleHandler = (name: string, state = true) => () => {
        chips.set(name, state);
        setChips(chips);
    };

    return (
        <ScrollView className={classes.root}>
            <Stack
                alignItems="center"
                direction="row"
                marginLeft="5px"
                marginRight="5px"
                spacing={1}
            >
                {listChips.map((chip, idx) => {
                    const name = chip.name.toString();
                    const enabled = !!chips.get(name);
                    return (
                        <Chip
                            variant={enabled ? 'filled' : 'outlined'}
                            onClick={!enabled ? createToggleHandler(name, true) : undefined}
                            onDelete={enabled ? createToggleHandler(name, false) : undefined}
                            label={chip.label}
                            color={chip.color}
                            key={idx}
                        />
                    );
                })}
            </Stack>
        </ScrollView>
    );
};

export default Chips;
