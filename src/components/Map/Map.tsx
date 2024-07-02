import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';

import type mapboxglInternal from 'mapbox-gl';

import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Center from '../Center';

import useActualCallback from '../../hooks/useActualCallback';
import useChangeSubject from '../../hooks/useChangeSubject';
import useActualValue from '../../hooks/useActualValue';
import useOnce from '../../hooks/useOnce';

import debounce from '../../utils/hof/debounce';

declare global {
    var mapboxgl: typeof mapboxglInternal;
}

const DEFAULT_ZOOM = 15;
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
    readonly = false,
    zoom = DEFAULT_ZOOM,
    onChange = () => undefined,
    ...otherProps
}: IMapProps) => {
    const disposeRef = useRef<Function>(null as never);

    const onChange$ = useActualCallback(onChange);

    const readonly$ = useActualValue(readonly);

    const changeSubject = useChangeSubject(pos);

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
            if (readonly$.current) {
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

        const un = changeSubject.subscribe((pos) => {
            if (pos) {
                const { lng, lat } = pos;
                marker.setLngLat({
                    lng,
                    lat,
                });
                map.setCenter({
                    lng,
                    lat,
                });
            }
        });

        disposeRef.current = () => {
            observer.unobserve(container);
            marker.remove();
            map.remove();
            un();
        };

    }, []);

    if (!pos) {
        return (
            <Center {...otherProps}>
                <Typography>
                    Point not choosen
                </Typography>
            </Center>
        );
    }

    return (
        <Box ref={handleRef} {...otherProps} />
    );
};

export default Map;
