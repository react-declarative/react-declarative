import React from 'react';

import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { FadeView, TabsView, ScaleView, ITab, useTabsHashstate } from 'react-declarative';

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

export const FadePage = () => {

    const {
        tabsProps,
    } = useTabsHashstate({
        history,
    });

    useEffect(() => {
        console.log('ctor')
        return () => {
            console.log('dtor')
        };
    }, []);

    return (
        <>
            <Grid item xs={12}>
                <FadeView disableRight heightRequest={() => 150} widthRequest={() => window.innerWidth - 50}>
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
                <FadeView disableBottom heightRequest={() => 150} widthRequest={() => window.innerWidth - 50}>
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
        </>
    );
}

export default FadePage;
