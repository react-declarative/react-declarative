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

import { MASTER_DETAIL_ROOT } from './config';

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

/**
 * Represents a master-detail component with various modes and customizations.
 * @template Payload - The payload type for the component.
 * @param {Object} props - The component props.
 * @param {MasterDetailMode} props.mode - The mode of the component. Default is MasterDetailMode.Card.
 * @param {boolean} props.withTransparentTabs - Specifies whether to use transparent tabs. Default is false.
 * @param {boolean} props.withMenuCollapse - Specifies whether to enable menu collapse. Default is false.
 * @param {boolean} props.withFixedPos - Specifies whether to fix the position. Default is false.
 * @param {number} props.fixedPosHeaderAdjust - The adjustment value for the fixed position header. Default is 0.
 * @param {string} props.title - The title of the component.
 * @param {string} props.className - The class name for the component.
 * @param {object} props.style - The inline style object for the component.
 * @param {object} props.sx - The theme-ui styles for the component.
 * @param {string} props.activeOption - The initially active option ID.
 * @param {Payload} props.payload - The payload for the component.
 * @param {array} props.deps - The dependencies array for the component.
 * @param {array} props.options - The options array for generating master-detail items.
 * @param {ReactNode} props.children - The child components.
 * @param {ComponentType} props.Loader - The loader component to show during async actions. Default is LoaderDefault.
 * @param {ComponentType} props.Error - The error component to show when an error occurs during async actions. Default is ErrorDefault.
 * @param {function} props.onActiveOptionChange - The callback function to handle active option change.
 * @param {ReactNode} props.fallback - The fallback component to show when there are no items available.
 * @param {function} props.onLoadStart - The callback function to execute when the async action starts.
 * @param {function} props.onLoadEnd - The callback function to execute when the async action ends.
 * @param {boolean} props.throwError - Specifies whether to throw an error during async actions.
 * @returns {JSX.Element} - The rendered component.
 */
export const MasterDetail = <Payload extends any = any>({
    mode = MasterDetailMode.Card,
    withTransparentTabs = false,
    withMenuCollapse = false,
    withFixedPos = false,
    fixedPosHeaderAdjust = 0,
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

        if (activeItem) {
            activeItem.active = true;
        }

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
                withTransparentTabs={withTransparentTabs}
                withMenuCollapse={withMenuCollapse}
                withFixedPos={withFixedPos}
                fixedPosHeaderAdjust={fixedPosHeaderAdjust}
                loading={loading}
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
        isOk = isOk || mode === MasterDetailMode.Tabs;
        return isOk;
    }, [mode]);

    return (
        <Box
            className={classNames(className, classes.root)}
            style={style}
            sx={sx}
        >
            <Container className={MASTER_DETAIL_ROOT} passthrough={isPassthrough} label={isMobile ? undefined : title}>
                {renderInner()}
            </Container>
        </Box>
    );
};

export default MasterDetail;
