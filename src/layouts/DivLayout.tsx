import * as React from 'react';

import IField from '../model/IField';
import IEntity from '../model/IEntity';
import IAnything from '../model/IAnything';
import { PickProp } from '../model/IManaged';

export interface IDivLayoutProps<Data = IAnything> {
    className?: PickProp<IField<Data>, 'className'>;
    style?: PickProp<IField<Data>, 'style'>;
}

interface IDivLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactChild;
}

export const DivLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
}: IDivLayoutProps<Data> & IDivLayoutPrivate<Data>) => (
    <div {...{className, style}}>
        {children}
    </div>
);

DivLayout.displayName = 'DivLayout';

export default DivLayout;
