import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import { makeStyles } from '../../styles';

import Content from './components/Content';
import Typography from "@mui/material/Typography";
import PaperView, { IPaperViewProps } from '../PaperView';

import ICord from "./model/ICord";

import useActualCallback from '../../hooks/useActualCallback';
import useAsyncValue from "../../hooks/useAsyncValue";

import { CONTROL_RECT } from './js/area-selector';

import classNames from '../../utils/classNames';
import readSize from "./utils/readSize";

interface IRoiViewProps extends Omit<IPaperViewProps, keyof {
    onChange: never;
}> {
    withNaturalSize?: boolean;
    src: string;
    readonly: boolean;
    cords: ICord[];
    onChange?: (cords: ICord[]) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
}

const useStyles = makeStyles()({
    readonly: {
        [`& .${CONTROL_RECT}`]: {
            display: 'none;'
        }
    },
    root: {
        display: 'flex',
        '& > *': {
            width: '100%',
        },
    }
})

const RoiViewInternal = ({
    withNaturalSize = false,
    className,
    src,
    cords: upperCords,
    readonly,
    onLoadStart,
    onLoadEnd,
    sx,
    onChange = () => undefined,
    ...otherProps
}: IRoiViewProps, ref: React.Ref<HTMLDivElement>) => {

    const { classes } = useStyles();

    const onChange$ = useActualCallback(onChange);

    const [value, { error }] = useAsyncValue(async () => await readSize(src), {
        onLoadStart,
        onLoadEnd,
    });

    const cords = useMemo(() => {
        let seen = new Set();
        return upperCords.filter((cord) => {
            return seen.has(cord.id) ? false : seen.add(cord.id);
        });
    }, [upperCords]);

    const renderInner = () => {
        if (value) {
            return (
                <Content
                    cords={cords}
                    naturalHeight={value.naturalHeight}
                    naturalWidth={value.naturalWidth}
                    onChange={onChange$}
                    readonly={readonly}
                    src={src}
                />
            );
        } else if (error) {
            return <Typography>Error aquired while fetching image</Typography>;
        } else {
            return <Typography>Loading...</Typography>;
        }
    };

    return (
        <PaperView
            ref={ref}
            className={classNames(className, classes.root, {
                [classes.readonly]: readonly,
            })}
            sx={{
                ...(withNaturalSize && {
                    height: value?.naturalHeight,
                    width: value?.naturalWidth,
                }),
                ...sx
            }}
            {...otherProps}
        >
            {renderInner()}
        </PaperView>
    )
};

export const RoiView = forwardRef(RoiViewInternal) as typeof RoiViewInternal;

export default RoiView;
