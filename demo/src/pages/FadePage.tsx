import React from 'react';

import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { FadeView, TabsView, ScaleView, ITab, useTabsHashstate, ActionButton, ActionIcon, ActionFilter, ActionTrigger, ActionStopIcon, ActionToggle, IActionFilter, IActionTrigger, useSnack } from 'react-declarative';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import history from '../history';

import sleep from '../utils/sleep';

const tabs: ITab[] = [
    {
        label: 'tab1',
        value: 'tab1',
        isDisabled: async () => {
            await sleep(3_000);
            return true;
        }
    },
    {
        label: 'tab2',
        value: 'tab2',
    },
    {
        label: 'tab3',
        value: 'tab3',
    },
];

const actions_filter: IActionFilter[] = [
    {
        action: 'first-filter',
        label: 'First filter',
        items: [
            {
                label: 'First item',
                value: 'first-item',
            },
            {
                label: 'Second item',
                value: 'second-item',
            },
            {
                label: 'Third item',
                value: 'third-item',
            }
        ],
    },
    {
        action: 'second-filter',
        label: 'Second filter',
        items: [
            {
                label: 'First item',
                value: 'first-item',
            },
            {
                label: 'Second item',
                value: 'second-item',
            },
            {
                label: 'Third item',
                value: 'third-item',
            }
        ],
    },
    {
        action: 'third-filter',
        label: 'Third filter',
        items: [
            {
                label: 'First item',
                value: 'first-item',
            },
            {
                label: 'Second item',
                value: 'second-item',
            },
            {
                label: 'Third item',
                value: 'third-item',
            }
        ],
    },
];

const actions_trigger: IActionTrigger[] = [
    {
        action: 'first-action',
        label: 'First action',
        isAvailable: async () => {
            await sleep(3_000);
            return true;
        },
    },
    {
        action: 'second-action',
        label: 'Second action',
        isAvailable: async () => {
            await sleep(3_000);
            return false;
        },
    },
    {
        action: 'third-action',
        label: 'Third action',
        isAvailable: async () => {
            await sleep(3_000);
            return true;
        },
    },
];

export const FadePage = () => {

    const {
        tabsProps,
    } = useTabsHashstate({
        history,
    });

    const notify = useSnack();

    useEffect(() => {
        console.log('ctor')
        return () => {
            console.log('dtor')
        };
    }, []);

    const handleClick = async (data: any) => {
        await sleep(3_000);
        console.log({ data })
        notify('click');
    };

    return (
        <>
            <Grid item xs={12}>
                <FadeView
                    disableRight
                    style={{
                        height: 100,
                        width: 'calc(100% - 50px)'
                    }}
                >
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        It has survived not only five centuries, but also the leap into electronic typesetting,
                        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
                        Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
                        of Lorem Ipsum.
                    </p>
                </FadeView>
            </Grid>
            <Grid item xs={12}>
                <FadeView
                    disableBottom
                    style={{
                        height: 50,
                        width: 'calc(100% - 50px)'
                    }}
                >
                    <p style={{ whiteSpace: 'nowrap' }}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        It has survived not only five centuries, but also the leap into electronic typesetting,
                        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
                        Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
                        of Lorem Ipsum.
                    </p>
                </FadeView>
            </Grid>
            <TabsView
                items={tabs}
                {...tabsProps}
            >
                {(value) => {
                    return () => <p>{value}</p>
                }}
            </TabsView>
            <ScaleView style={{ width: '100%', height: 300, background: 'magenta' }} center>
                <div
                    style={{
                        height: 200,
                        width: 300,
                        background: 'cyan',
                    }}
                />
            </ScaleView>
            <ActionButton sx={{ m: 1 }} onClick={handleClick}>
                Action button
            </ActionButton>
            <ActionFilter sx={{ m: 1 }} data={{ 'first-filter': 'second-item' }} actions={actions_filter} onChange={console.log} />
            <ActionTrigger sx={{ m: 1 }} actions={actions_trigger} onAction={handleClick} />
            <ActionIcon sx={{ m: 1 }} onClick={handleClick}>
                <AddIcon />
            </ActionIcon>
            <ActionStopIcon onClick={handleClick} sx={{ m: 1 }}>
                <DeleteIcon />
            </ActionStopIcon>
            <ActionStopIcon onClick={handleClick} sx={{ m: 1 }} />
            <ActionStopIcon onClick={handleClick} noProgress sx={{ m: 1 }} />
            <ActionToggle onClick={handleClick} defaultChecked sx={{ m: 1 }} />
        </>
    );
}

export default FadePage;
