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

import TSubject from '../../model/TSubject';

import singleshot from '../../utils/hof/singleshot';
import debounce from '../../utils/hof/debounce';

import mapboxgl from "mapbox-gl";

declare global {}

const DEFAULT_ZOOM = 15;
const CHANGE_DEBOUNCE = 500;
const COMPARE_DECIMALS = 6;
const DEFAULT_TOKEN = "pk.eyJ1IjoidHJpcG9sc2t5cGV0ciIsImEiOiJjbHk0YWgzNmUwMGRiMmpzN3hzbjB4Z3J2In0.3oxAilQNCBFw7zO0AIbxfQ";

interface IPosition {
    lng: number;
    lat: number;
}

const toFixedDecimals = (pos: IPosition) => {
    const lat = pos.lat.toFixed(COMPARE_DECIMALS);
    const lng = pos.lng.toFixed(COMPARE_DECIMALS);
    return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
    };
};

const comparePos = (pos1: IPosition | undefined, pos2: IPosition | undefined) => {
    if (!pos1 || !pos2) {
        return false;
    }
    const pos1Lat = pos1.lat.toFixed(COMPARE_DECIMALS);
    const pos1lng = pos1.lng.toFixed(COMPARE_DECIMALS);
    const pos2Lat = pos2.lat.toFixed(COMPARE_DECIMALS);
    const pos2lng = pos2.lng.toFixed(COMPARE_DECIMALS);
    let isEqual = true;
    isEqual = isEqual && pos1Lat === pos2Lat;
    isEqual = isEqual && pos1lng === pos2lng;
    return isEqual;
};

interface IMapProps extends Omit<BoxProps, keyof {
    onChange: never;
}> {
    withZoomAdjust?: boolean;
    readonly?: boolean;
    value?: IPosition;
    zoom?: number;
    token?: string;
    onChange?: (position: IPosition) => void;
}

export const Map = ({
    withZoomAdjust = false,
    value: pos,
    readonly = false,
    zoom = DEFAULT_ZOOM,
    token = DEFAULT_TOKEN,
    onChange = () => undefined,
    ...otherProps
}: IMapProps) => {
    const disposeRef = useRef<Function>(null as never);

    const onChange$ = useActualCallback(onChange);

    const readonly$ = useActualValue(readonly);
    const pos$ = useActualValue(pos);

    const changeSubject: TSubject<IPosition | undefined> = useChangeSubject(pos);

    const handleChange = useMemo(() => debounce((pos: IPosition) => {
        const pendingPos = toFixedDecimals(pos);
        if (!comparePos(pendingPos, pos$.current)) {
            onChange$(pendingPos);
        }
    }, CHANGE_DEBOUNCE), []);

    useOnce(() => () => {
        disposeRef.current && disposeRef.current();
        handleChange.clear();
    });

    const handleRef = useCallback((container: HTMLDivElement | null) => {
        
        const { current: pos } = pos$;

        disposeRef.current && disposeRef.current();
        
        if (!container) {
            return;
        }

        if (!pos) {
            return;
        }

        mapboxgl.accessToken = token;

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

        if (withZoomAdjust) {
            let zoomCenter: mapboxglInternal.LngLat;

            map.on('zoomstart', () => {
                zoomCenter = map.getCenter();
            });
    
            map.on('zoomend', () => {
                map.setCenter(zoomCenter);
                marker.setLngLat(zoomCenter);
            });
        }

        marker.addTo(map);

        observer.observe(container);

        const un = changeSubject.subscribe((pos) => {
            if (!pos) {
                return;
            }
            const mapPos = map.getCenter();
            if (comparePos(pos, mapPos)) {
                return;
            }
            const { lng, lat } = pos;
            marker.setLngLat({
                lng,
                lat,
            });
            map.setCenter({
                lng,
                lat,
            });
        });

        disposeRef.current = singleshot(() => {
            observer.unobserve(container);
            marker.remove();
            map.remove();
            un();
        });

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
