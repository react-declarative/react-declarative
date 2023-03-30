import * as React from 'react';

import Box from '@mui/material/Box';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { PickProp } from '../../../model/IManaged';

import makeLayout from '../components/makeLayout/makeLayout';

export interface IBoxLayoutProps<Data = IAnything, Payload = IAnything> {
    className?: PickProp<IField<Data, Payload>, 'className'>;
    style?: PickProp<IField<Data, Payload>, 'style'>;
    sx?: PickProp<IField<Data, Payload>, 'sx'>;
}

interface IBoxLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactNode;
}

export const BoxLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    sx,
}: IBoxLayoutProps<Data> & IBoxLayoutPrivate<Data>) => (
    <Box
        className={className}
        style={style}
        sx={sx}
    >
        {children}
    </Box>
);

BoxLayout.displayName = 'BoxLayout';

export default makeLayout(BoxLayout) as typeof BoxLayout;
