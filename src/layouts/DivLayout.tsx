import * as React from 'react';

import IEntity from '../model/IEntity';
import IField from '../model/IField';
import { PickProp } from '../model/IManaged';

export interface IDivLayoutProps {
    className?: PickProp<IField, 'className'>;
    style?: PickProp<IField, 'style'>;
}

interface IDivLayoutPrivate extends IEntity {
    children: React.ReactChild;
}

export const DivLayout = ({
    children,
    className,
    style,
}: IDivLayoutProps & IDivLayoutPrivate) => (
    <div {...{className, style}}>
        {children}
    </div>
);

DivLayout.displayName = 'DivLayout';

export default DivLayout;
