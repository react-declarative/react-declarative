import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';

import { makeStyles } from '../../styles';

import Box from '@mui/material/Box';

import LoaderView from '../LoaderView';

import Container from './components/Container';
import Content from './components/Content';

import idToLabel from '../Scaffold2/utils/idToLabel';
import classNames from '../../utils/classNames';

import useMediaContext from '../../hooks/useMediaContext';
import useAsyncAction from '../../hooks/useAsyncAction';
import useActualValue from '../../hooks/useActualValue';

import IMasterDetailProps from './model/IMasterDetailProps';
import MasterDetailMode from './model/MasterDetailMode';
import { IMasterDetailOptionInternal } from './model/IMasterDetailOption';

const LoaderDefault = LoaderView.createLoader(48);
const ErrorDefault = () => <></>;

const useStyles = makeStyles()({
    root: {
        width: '100%',
        minHeight: 225,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *': {
            flex: 1,
        },
    },
});

export const MasterDetail = <Payload extends any = any>({
    mode = MasterDetailMode.Card,
    title,
    className,
    style,
    sx,
    activeOption: upperActiveOption = "",
    payload,
    deps = [],
    options,
    children,
    Loader = LoaderDefault,
    Error = ErrorDefault,
    onActiveOptionChange,
    fallback,
    onLoadStart,
    onLoadEnd,
    throwError,
}: IMasterDetailProps<Payload>) => {

    const { isMobile } = useMediaContext();
    const { classes } = useStyles();

    const [activeOption, setActiveOption] = useState(upperActiveOption);

    const activeOption$ = useActualValue(activeOption);

    const [items, setItems] = useState<IMasterDetailOptionInternal[]>([]);

    const {
        loading,
        error,
        execute,
    } = useAsyncAction(async (payload) => {
        let items = await Promise.all(options.map(async ({
            id,
            label,
            isVisible = () => true,
            isDisabled = () => false,
            isActive = () => activeOption$.current === id,
            ...option
        }) => ({
            id,
            visible: await isVisible(payload),
            disabled: await isDisabled(payload),
            active: await isActive(payload),
            label: label || idToLabel(id),
            ...option
        })));

        items = items.filter(({ visible }) => visible);

        const activeItem = items.find(({ active }) => active) || items[0];

        activeItem.active = true;

        return items;
    }, {
        onLoadStart,
        onLoadEnd,
        throwError,
        fallback,
    });

    useEffect(() => {
        execute(payload)
            .then((items) => {
                if (!items) {
                    return;
                }
                if (!activeOption$.current) {
                    const activeItem = items.find(({ active }) => active);
                    activeItem && handleChange(activeItem.id, true);
                }
                setItems(items);
            });
    }, [payload, activeOption, ...deps]);

    const handleChange = (activeOption: string, initial = false) => {
        setActiveOption(activeOption);
        onActiveOptionChange && onActiveOptionChange(activeOption, initial);
    };

    const renderInner = () => {
        if (loading) {
            return <Loader />
        }
        if (error) {
            return <Error />
        }
        return (
            <Content
                items={items}
                mode={mode}
                onChange={handleChange}
            >
                {children}
            </Content>
        );
    };

    const isPassthrough = useMemo(() => {
        let isOk = false;
        isOk = isOk || mode === MasterDetailMode.Outline;
        isOk = isOk || mode === MasterDetailMode.Paper;
        return isOk;
    }, [mode]);

    return (
        <Box
            className={classNames(className, classes.root)}
            style={style}
            sx={sx}
        >
            <Container passthrough={isPassthrough} label={isMobile ? undefined : title}>
                {renderInner()}
            </Container>
        </Box>
    );
};

export default MasterDetail;
