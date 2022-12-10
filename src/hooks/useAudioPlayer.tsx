import * as React from 'react';
import { useRef, useState } from 'react';

import useReloadTrigger from './useReloadTrigger';

interface IParams {
    src: string;
}

export const useAudioPlayer = ({
    src,
}: IParams) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { doReload, reloadTrigger } = useReloadTrigger();

    const handleStart = () => {
        setIsPlaying(true);
        doReload();
    };

    const handleEnd = () => {
        setIsPlaying(false);
    };

    const render = () => (
        <>
            {isPlaying && (
                <audio
                    key={reloadTrigger}
                    ref={audioRef}
                    src={src}
                    controls
                    autoPlay
                    hidden
                    onEnded={handleEnd}
                />
            )}
        </>
    );

    return {
        audioRef,
        render,
        play: handleStart,
    };
};

export default useAudioPlayer;
