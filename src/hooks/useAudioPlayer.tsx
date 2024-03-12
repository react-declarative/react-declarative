import * as React from 'react';
import { useRef, useState } from 'react';

import useReloadTrigger from './useReloadTrigger';

interface IParams {
    src: string;
}

/**
 * Creates an audio player that can be used to play audio files.
 *
 * @param params - The parameters for the audio player.
 * @returns An object with properties and functions for controlling the audio player.
 */
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
