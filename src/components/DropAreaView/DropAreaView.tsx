import * as React from 'react';
import { useCallback, useRef, useState } from 'react';

import { makeStyles } from '../../styles';
import { alpha } from '@mui/material';

import PaperView, { IPaperViewProps } from "../PaperView";
import Typography from '@mui/material/Typography';

import useActualCallback from '../../hooks/useActualCallback';

import classNames from '../../utils/classNames';

import UploadIcon from "@mui/icons-material/CloudUpload";

export interface IDropAreaProps extends IPaperViewProps {
    onDropped?: (files: File[]) => void;
}

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        overflow: 'hidden',
    },
    container: {
        flex: 1,
    },
    dropModal: {
        position: 'absolute',
        background: alpha(theme.palette.background.default, 0.5),
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 15,
        padding: theme.spacing(1),
        color: theme.palette.action.active,
    },
    icon: {
        fontSize: 48,
    },
}));

export const DropAreaView = ({
    className,
    children,
    onDropped = () => undefined,
    ...otherProps
}: IDropAreaProps) => {

    const { classes } = useStyles();

    const [drag, setDrag] = useState(false);
    const counter = useRef(0);

    const disposeRef = useRef<Function | null>(null);

    const onDropped$ = useActualCallback(onDropped);

    const handleDrop = useCallback((e: any) => {
        e.preventDefault();
        const { dataTransfer } = e;
        const files = Array.from(dataTransfer.files) as File[];
        onDropped$(files);
    }, []);

    const handleDrag = useCallback((target: HTMLDivElement | null) => {
        disposeRef.current && disposeRef.current();
        if (!target) {
            return;
        }

        const handler = (enter = true) => (e: any) => {
            e.preventDefault();
            counter.current += enter ? 1 : -1;
            setDrag(counter.current > 0);
        };

        const passive = (e: any) => e.preventDefault();
        const leave = handler(false);
        const enter = handler(true);

        document.body.addEventListener('dragenter', enter);
        document.body.addEventListener('dragleave', leave);
        document.body.addEventListener('dragover', passive);
        document.body.addEventListener('drop', handleDrop);

        disposeRef.current = () => {
            document.body.removeEventListener('dragenter', enter);
            document.body.removeEventListener('dragleave', leave);
            document.body.removeEventListener('dragover', passive);
            document.body.removeEventListener('drop', handleDrop);
        };
    }, []);

    return (
        <PaperView ref={handleDrag} className={classNames(className, classes.root)} {...otherProps}>
            <div className={classes.container}>
                {children}
            </div>
            {drag && (
                <div className={classes.dropModal}>
                    <Typography variant="h6">
                        Drop files to continue
                    </Typography>
                    <UploadIcon className={classes.icon} />
                </div>
            )}
        </PaperView>
    );
};

export default DropAreaView;
