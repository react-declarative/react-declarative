import * as React from 'react';

import Container from './components/Container';

import IScaffold2Props from './model/IScaffold2Props';
import Payload from './model/Payload';

export const Scaffold2 = <T extends Payload = Payload>({
    children,
    ...otherProps
}: IScaffold2Props<T>) => {

    return (
        <Container<T> {...otherProps as any}>
            {children}
        </Container>
    );
};

export default Scaffold2;
