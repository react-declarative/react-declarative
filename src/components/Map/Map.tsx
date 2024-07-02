import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';

import type mapboxglInternal from 'mapbox-gl';

import Box, { BoxProps } from '@mui/material/Box';

import useActualCallback from '../../hooks/useActualCallback';
import useOnce from '../../hooks/useOnce';

import debounce from '../../utils/hof/debounce';

declare global {
    var mapboxgl: typeof mapboxglInternal;
}

const DEFAULT_ZOOM = 10;
const CHANGE_DEBOUNCE = 500;

interface IPosition {
    lng: number;
    lat: number;
}

interface IMapProps extends Omit<BoxProps, keyof {
    onChange: never;
}> {
    readonly?: boolean;
    value?: IPosition;
    zoom?: number;
    onChange?: (position: IPosition) => void;
}

export const Map = ({
    value: pos,
    readonly,
    zoom = DEFAULT_ZOOM,
    onChange = () => undefined,
    ...otherProps
}: IMapProps) => {
    const disposeRef = useRef<Function>(null as never);

    const onChange$ = useActualCallback(onChange);

    const handleChange = useMemo(() => debounce((pos: IPosition) => {
        onChange$(pos);
    }, CHANGE_DEBOUNCE), []);

    useOnce(() => () => {
        disposeRef.current && disposeRef.current();
        handleChange.clear();
    });

    const handleRef = useCallback((container: HTMLDivElement | null) => {
        if (!container) {
            return;
        }

        disposeRef.current && disposeRef.current();

        const map = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: pos,
            zoom,
        });

        const observer = new ResizeObserver(() => {
            map.resize()
        });

        let marker = new mapboxgl.Marker();

        if (pos) {
            marker = marker.setLngLat(pos);
        }
        
        marker.addTo(map);

        map.on('move', () => {
            if (readonly) {
                return;
            }
            const { lng, lat } = map.getCenter();
            marker.setLngLat({
                lng,
                lat,
            });
            handleChange({
                lat,
                lng,
            });
        });

        marker.addTo(map);

        observer.observe(container);

        disposeRef.current = () => {
            observer.unobserve(container);
            marker.remove();
            map.remove();
        };

    }, []);

    return (
        <Box ref={handleRef} {...otherProps} />
    );
};

export default Map;
