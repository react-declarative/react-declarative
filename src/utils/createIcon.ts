import * as React from 'react';
import { createElement as h } from 'react';

import { Icon as MatIcon } from '@material-ui/core';

export const createIcon = (icon: string | React.ComponentType) => typeof icon === 'string'
    ? h(MatIcon, null, icon)
    : h(icon);

export default createIcon;
