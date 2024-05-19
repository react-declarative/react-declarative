import * as React from 'react';

import { makeStyles } from '../../../../styles';

import classNames from '../../../../utils/classNames';

const BASELINE_ADJUST_MARK = "react-declarative__oneBaselineAdjust"

const useStyles = makeStyles()({
    baselineAdjust: {
        height: '100%',
        width: '100%',
    },
});

export const BaselineAdjust = () => {
    const { classes } = useStyles();
    return <div className={classNames(classes.baselineAdjust, BASELINE_ADJUST_MARK)} />
};

export default BaselineAdjust;
