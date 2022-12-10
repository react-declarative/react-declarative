import * as React from 'react';
import { useRef, useState } from 'react';

interface IParams {
    src: string;
}

export const useAudioPlayer = ({
    src,
}: IParams) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleStart = () => {
        setIsPlaying(true);
    };

    const handleEnd = () => {
        setIsPlaying(false);
    };

    const render = () => (
        <>
            {isPlaying && (
                <audio
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
