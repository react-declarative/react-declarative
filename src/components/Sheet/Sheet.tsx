import * as React from 'react';
import { forwardRef, useMemo, useState } from 'react';

import { makeStyles } from '../../styles';
import { SxProps } from '@mui/material';

import Box, { BoxProps } from '@mui/material/Box';

import ScrollView, { SCROLL_VIEW_TARGER } from '../ScrollView';
import ActionFab from '../ActionFab';

import FullscreenIcon from "@mui/icons-material/Fullscreen";

import classNames from '../../utils/classNames';

interface ISheetProps extends BoxProps {
    withFullScreen?: boolean;
    withHeader?: boolean;
    maxCols?: number;
    maxRows?: number;
    data: string[][];
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    ref?: React.Ref<HTMLDivElement | undefined>;
}

const MAX_COLUMN_COUNT = 25;
const MAX_ROW_COUNT = 100;
const FAB_SIZE = 48;

interface Element extends HTMLElement {
    setHTML: (...args: any) => any;
}

const useStyles = makeStyles()((theme) => ({
    root: {
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        flexDirection: "column",
        minHeight: "100%",
        width: "100%",
        [`& .${SCROLL_VIEW_TARGER}`]: {
            "& > div > div": {
                marginBottom: theme.spacing(2),
            },
        },
    },
    container: {
        position: "relative",
        flex: 1,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
    },
    content: {
        flex: 1,
        display: "flex",
    },
    cell: {
        border: `1px solid ${theme.palette.action.active}`,
        padding: theme.spacing(0.5),
        margin: theme.spacing(0.5),
    },
    headerCell: {
        background: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    fabFullscreen: {
        position: 'absolute',
        transition: 'opacity 150ms',
        opacity: 0,
        bottom: 10,
        right: 10,
        zIndex: 2,
    },
    fabFullscreenToggle: {
        opacity: 1,
    },
}));

const normalizaAoa = (data: string[][]) => {
    const maxWidth = data.reduce((acm, cur) => Math.max(acm, cur.length), 0);
    return data.map((src) => {
        const dst = Array(maxWidth).fill("");
        src.forEach((cell, idx) => dst[idx] = cell);
        return dst;
    });
};

const sanitize = (html: string) => {
    if ('Sanitizer' in window) {
        const sanitizer = new window.Sanitizer();
        const element = document.createElement('div') as unknown as Element;
        element.setHTML(html, { sanitizer });
        return element.innerHTML;
    }
    return html;
};

const rendetHTML = (headerRow: string[], contentRows: string[][]) => {
    let result = "";
    result += "<style>table{border-collapse:collapse;min-width:100%}td,th{border:1px solid #ddd;text-align:left;padding:8px}th{background-color:#f2f2f2}</style>";
    result += "<table>";
    if (headerRow.length) {
        result += "<thead>";
        result += "<tr>";
        headerRow.forEach((column) => {
            result += `<th>${sanitize(column)}</th>`;
        });
        result += "</tr>";
        result += "</thead>";
    }
    result += "<tbody>";
    contentRows.forEach((row) => {
        result += "<tr>";
        row.forEach((cell) => {
            result += `<td>${sanitize(cell)}</td>`;
        });
        result += "</tr>";
    });
    result += "</tbody>";
    return result;
}

const SheetInternal = ({
    data: upperData,
    maxCols = MAX_COLUMN_COUNT,
    maxRows = MAX_ROW_COUNT,
    withHeader,
    withFullScreen,
    className,
    style,
    sx,
    ...otherProps
}: ISheetProps, ref: React.Ref<HTMLDivElement>) => {
    const { classes } = useStyles();

    const [hover, setHover] = useState(false);

    const data = useMemo(() => normalizaAoa(upperData), [upperData]);

    const headerRow = useMemo(() => {
        if (!withHeader) {
            return [];
        }
        const [headerRow = []] = data;
        return headerRow.slice(0, maxCols);
    }, [withHeader, data, maxCols]);

    const contentRows = useMemo(() => {
        if (withHeader) {
            return data.slice(1, maxRows).map((row) => row.slice(0, maxCols));
        }
        return data.slice(0, maxRows).map((row) => row.slice(0, maxCols));
    }, [withHeader, maxRows, maxCols, data]);

    const renderTable = () => (
        <table>
            {!!headerRow.length && (
                <thead>
                    <tr>
                        {headerRow.map((column, idx) => (
                            <th key={`${column}-${idx}`} className={classes.headerCell}>
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
            )}
            <tbody>
                {contentRows.map((row, idx) => (
                    <tr key={`${row.length}-${idx}`}>
                        {row.map((column, idx) => (
                            <td key={`${column}-${idx}`} className={classes.cell}>
                                {column}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <Box
            {...otherProps}
            ref={ref}
            className={classNames(classes.root, className)}
            style={style}
            sx={sx}
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        >
            <Box className={classes.container}>
                <ScrollView withScrollbar className={classes.content}>
                    {renderTable()}
                </ScrollView>
                {withFullScreen && (
                    <ActionFab
                        className={classNames(classes.fabFullscreen, {
                            [classes.fabFullscreenToggle]: hover,
                        })}
                        color="primary"
                        size={FAB_SIZE}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const customContent = rendetHTML(headerRow, contentRows);
                            const hndl = window.open('about:blank', '_blank', 'width=600,height=400');
                            if (hndl) {
                                hndl.document.write(customContent);
                                hndl.document.close();
                            }
                        }}
                    >
                        <FullscreenIcon color="inherit" />
                    </ActionFab>
                )}
            </Box>
        </Box>
    );
}

export const Sheet = forwardRef(SheetInternal) as typeof SheetInternal;

export default Sheet;
