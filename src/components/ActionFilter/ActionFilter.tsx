import * as React from 'react';
import { useState } from 'react';

import Box, { BoxProps as MatBoxProps } from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import AddIcon from '@mui/icons-material/Add';

import useChange from '../../hooks/useChange';
import useActualCallback from '../../hooks/useActualCallback';

import IActionFilterProps from './model/IActionFilterProps';

type BoxProps = Omit<MatBoxProps, keyof {
    onChange: never;
}>;

export const ActionFilter = ({
    actions,
    label = 'Filters',
    addLabel = 'Add filter',
    data: initialData = {},
    onChange = () => null,
    ...otherProps
}: BoxProps & IActionFilterProps) => {

    const [data, setData] = useState(new Map<string, string>(Object.entries(initialData)));

    const onChange$ = useActualCallback(onChange);

    useChange(() => {
        const result = [...data.entries()].reduce((acm, [key, value]) => ({...acm, [key]: value}), {});
        onChange$(result);
    }, [data]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const options = actions.filter(({ action }) => !data.has(action))

    const handleAddFilter = (action: string) => {
        const item = actions.find((item) => item.action === action);
        if (item) {
            const [option] = item.items;
            if (option) {
                setData((data) => {
                    data.set(action, option.value);
                    return new Map(data);
                });
                setAnchorEl(null);
            } else {
                return;
            }
        } else {
            return;
        }
    };

    const handleOpen = (e: any) => {
        setAnchorEl(e.target);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            {...otherProps}
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: {
                    xs: 'column',
                    sm: 'row',
                },
                gap: 1,
                ...otherProps.sx,
            }}
        >
            {actions.map((action, idx) => {
                const value = data.get(action.action);
                if (value) {
                    const item = action.items.find((item) => item.value === value) || null;
                    return (
                        <Autocomplete
                            key={idx}
                            value={item}
                            size="small"
                            options={action.items}
                            sx={{
                                width: {
                                    xs: '100%',
                                    sm: 175,
                                }
                            }}
                            getOptionLabel={({ label }) => label}
                            renderInput={(params) => (
                                <TextField {...params} label={label} />
                            )}
                            onChange={(_, value) => {
                                setData((data) => {
                                    if (value) {
                                        data.set(action.action, value.value);
                                    } else {
                                        data.delete(action.action);
                                    }
                                    return new Map(data);
                                });
                            }}
                        />
                    );
                } else {
                    return null;
                }
            })}
            <Button
                onClick={handleOpen}
                disabled={!options.length}
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                sx={{
                    whiteSpace: 'nowrap',
                    minHeight: {
                        xs: 'unset',
                        sm: 40,
                    },
                    maxHeight: {
                        xs: 'unset',
                        sm: 40,
                    },
                    width: {
                        xs: '100%',
                        sm: 'unset',
                    }
                }}
            >
                {addLabel}
            </Button>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                MenuListProps={{
                    sx: {
                        maxHeight: '45vh',
                        overflowY:'auto',
                        overflowX: 'hidden',
                    },
                }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => handleAddFilter(option.action)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default ActionFilter;
