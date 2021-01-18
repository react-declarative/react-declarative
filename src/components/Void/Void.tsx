import * as React from 'react';
import IField from '../../model/IField';
import { PickProp } from '../../model/IManaged';

export interface IVoidProps {
    className: PickProp<IField, 'className'>;
    style: PickProp<IField, 'style'>;
}

interface IVoidPrivate {
    children: React.ReactChild;
}

export const Void = ({
    children,
    className,
    style
}: IVoidProps & IVoidPrivate) => (
    <div {...{ className, style }}>{children}</div>
);

Void.displayName = 'Void';

export default Void;
