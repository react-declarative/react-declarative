import * as React from 'react';
import { useState } from 'react';

import Box from '@mui/material/Box';

import Async from '../Async';
import LoaderView from '../LoaderView';

import Container from './components/Container';
import Content from './components/Content';

import idToLabel from '../Scaffold2/utils/idToLabel';

import IMasterDetailProps from './model/IMasterDetailProps';

const Loader = LoaderView.createLoader(48);

export const MasterDetail = <Payload extends any = any>({
    title,
    className,
    style,
    sx,
    activeOption: upperActiveOption = "",
    payload,
    options,
    children,
    onActiveOptionChange,
    fallback,
    onLoadStart,
    onLoadEnd,
    throwError,
}: IMasterDetailProps<Payload>) => {
    const [activeOption, setActiveOption] = useState(upperActiveOption);

    const handleChange = (activeOption: string) => {
        setActiveOption(activeOption);
        onActiveOptionChange && onActiveOptionChange(activeOption);
    };

    return (
        <Box
            className={className}
            style={style}
            sx={sx}
        >
            <Container label={title}>
                <Async
                    Loader={Loader}
                    fallback={fallback}
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadEnd}
                    throwError={throwError}
                    payload={payload}
                    deps={[activeOption]}
                >
                    {async (payload) => {
                        const items = await Promise.all(options.map(async ({
                            id,
                            label,
                            isVisible = () => true,
                            isDisabled = () => false,
                            isActive = () => activeOption === id,
                            ...option
                        }) => ({
                            id,
                            visible: await isVisible(payload),
                            disabled: await isDisabled(payload),
                            active: await isActive(payload),
                            label: label || idToLabel(id),
                            ...option
                        })));

                        const activeItem = items.find(({ id }) => id === activeOption) || items[0];
                        const activeId = activeItem?.id || 'unknown';

                        activeItem.active = true;

                        return (
                            <Content items={items} onChange={handleChange}>
                                {await children(activeId, payload)}
                            </Content>
                        );
                    }}
                </Async>
            </Container>
        </Box>
    );
};

export default MasterDetail;
