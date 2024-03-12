import { useState, useMemo, useEffect } from 'react';
import debounce from '../utils/hof/debounce';

import useActualCallback from './useActualCallback';
import useActualValue from './useActualValue';
import useSingleton from './useSingleton';

const COMPRESS_FRAME = 0.8;
const MAX_FPS = 25;

interface IParams {
    fallback?: (e: Error) => void;
    onChange?: (stream: MediaStream, ids: {
        audioCaptureId: string;
        cameraCaptureId: string;
        screenCaptureId: string;
    }) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
    compressFrame?: number;
    maxFps?: number;
    withInitialVideo?: boolean;
    withInitialAudio?: boolean;
}

/**
 * Creates a media stream builder that provides functionality to capture audio, video, and screen using the WebRTC API.
 * @param [params] - The parameters for the media stream builder.
 * @param [params.fallback] - The fallback function to be called when an error occurs during capture. It receives an Error object as its argument.
 * @param [params.onLoadStart] - The callback function to be called when the capture starts.
 * @param [params.onLoadEnd] - The callback function to be called when the capture ends.
 * @param [params.onChange] - The callback function to be called when the media stream changes. It receives the media stream and an object with the current capture IDs as
 * arguments.
 * @param [params.throwError=false] - Determines whether to throw an error when an error occurs during capture instead of using the fallback function.
 * @param [params.withInitialVideo=false] - Determines whether to capture video when the media stream builder is initialized.
 * @param [params.withInitialAudio=false] - Determines whether to capture audio when the media stream builder is initialized.
 * @param [params.compressFrame=COMPRESS_FRAME] - The factor to compress the video frame by. (COMPRESS_FRAME is a constant value)
 * @param [params.maxFps=MAX_FPS] - The maximum frame rate of the video capture. (MAX_FPS is a constant value)
 * @returns The media stream builder.
 * @property {MediaStream} mediaStream - The media stream that contains the captured audio and video tracks.
 * @property {boolean} hasAudioCapture - Determines whether audio capture is currently active.
 * @property {boolean} hasCameraCapture - Determines whether camera capture is currently active.
 * @property {boolean} hasScreenCapture - Determines whether screen capture is currently active.
 * @property {Function} requestScreenCapture - Function to request screen capture.
 * @property {Function} requestCameraCapture - Function to request camera capture.
 * @property {Function} requestAudioCapture - Function to request audio capture.
 * @property {Function} stopScreenCapture - Function to stop screen capture.
 * @property {Function} stopCameraCapture - Function to stop camera capture.
 * @property {Function} stopAudioCapture - Function to stop audio capture.
 */
export const useMediaStreamBuilder = ({
    fallback,
    onLoadStart,
    onLoadEnd,
    onChange = () => undefined,
    throwError = false,
    withInitialVideo = false,
    withInitialAudio = false,
    compressFrame = COMPRESS_FRAME,
    maxFps = MAX_FPS,
}: IParams = {}) => {

    const [audioCaptureId, setAudioCaptureId] = useState("");
    const [cameraCaptureId, setCameraCaptureId] = useState("");
    const [screenCaptureId, setScreenCaptureId] = useState("");

    const audioCaptureId$ = useActualValue(audioCaptureId);
    const cameraCaptureId$ = useActualValue(cameraCaptureId);
    const screenCaptureId$ = useActualValue(screenCaptureId);

    const onChange$ = useActualCallback(onChange);
    const onChangeD = useMemo(() => debounce(onChange$, 100), []);

    const mediaStream = useSingleton(() => new MediaStream());

    const requestScreenCapture = useActualCallback(async () => {
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                  frameRate: { max: maxFps },
                  width: { ideal: window.screen.width * compressFrame },
                  height: { ideal: window.screen.height * compressFrame },
                },
                audio: false,
              });
            const prevTrack = mediaStream.getVideoTracks().find(({ id }) => id === screenCaptureId);
            prevTrack && mediaStream.removeTrack(prevTrack);
            const [currentTrack] = stream.getVideoTracks();
            currentTrack.addEventListener('inactive', () => {
                const prevTrack = mediaStream.getVideoTracks().find(({ id }) => id === screenCaptureId);
                prevTrack && mediaStream.removeTrack(prevTrack);
                setScreenCaptureId("");
                onChangeD(mediaStream, {
                    screenCaptureId: "",
                    audioCaptureId: audioCaptureId$.current,
                    cameraCaptureId: cameraCaptureId$.current,
                });
            });
            mediaStream.addTrack(currentTrack);
            setScreenCaptureId(currentTrack.id);
            onChangeD(mediaStream, {
                screenCaptureId: currentTrack.id,
                audioCaptureId: audioCaptureId$.current,
                cameraCaptureId: cameraCaptureId$.current,
            });
        } catch (e: any) {
            isOk = false;
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
        }
    });

    const requestCameraCapture = useActualCallback(async () => {
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                  facingMode: 'user',
                  frameRate: { max: maxFps },
                  width: { min: 0, max: window.screen.width * compressFrame },
                  height: { min: 0, max: window.screen.height * compressFrame },
                },
                audio: false,
              });
            const prevTrack = mediaStream.getVideoTracks().find(({ id }) => id === cameraCaptureId);
            prevTrack && mediaStream.removeTrack(prevTrack);
            const [currentTrack] = stream.getVideoTracks();
            currentTrack.addEventListener('inactive', () => {
                const prevTrack = mediaStream.getVideoTracks().find(({ id }) => id === cameraCaptureId);
                prevTrack && mediaStream.removeTrack(prevTrack);
                setCameraCaptureId("");
                onChangeD(mediaStream, {
                    screenCaptureId: screenCaptureId$.current,
                    audioCaptureId: audioCaptureId$.current,
                    cameraCaptureId: "",
                });
            });
            mediaStream.addTrack(currentTrack);
            setCameraCaptureId(currentTrack.id);
            onChangeD(mediaStream, {
                screenCaptureId: screenCaptureId$.current,
                audioCaptureId: audioCaptureId$.current,
                cameraCaptureId: currentTrack.id,
            });
        } catch (e: any) {
            isOk = false;
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
        }
    });

    const requestAudioCapture = useActualCallback(async () => {
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            const stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {
                  sampleSize: 16,
                  channelCount: 2
                },
              });
            const prevTrack = mediaStream.getAudioTracks().find(({ id }) => id === audioCaptureId);
            prevTrack && mediaStream.removeTrack(prevTrack);
            const [currentTrack] = stream.getAudioTracks();
            currentTrack.addEventListener('inactive', () => {
                const prevTrack = mediaStream.getAudioTracks().find(({ id }) => id === audioCaptureId);
                prevTrack && mediaStream.removeTrack(prevTrack);
                setAudioCaptureId("");
                onChangeD(mediaStream, {
                    screenCaptureId: screenCaptureId$.current,
                    audioCaptureId: "",
                    cameraCaptureId: cameraCaptureId$.current,
                });
            });
            mediaStream.addTrack(currentTrack);
            setAudioCaptureId(currentTrack.id);
            onChangeD(mediaStream, {
                screenCaptureId: screenCaptureId$.current,
                audioCaptureId: currentTrack.id,
                cameraCaptureId: cameraCaptureId$.current,
            });
        } catch (e: any) {
            isOk = false;
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
        }
    });

    const stopScreenCapture = useActualCallback(() => {
        const prevTrack = mediaStream.getVideoTracks().find(({ id }) => id === screenCaptureId);
        prevTrack && prevTrack.stop();
    });

    const stopCameraCapture = useActualCallback(() => {
        const prevTrack = mediaStream.getVideoTracks().find(({ id }) => id === cameraCaptureId);
        prevTrack && prevTrack.stop();
    });

    const stopAudioCapture = useActualCallback(() => {
        const prevTrack = mediaStream.getAudioTracks().find(({ id }) => id === audioCaptureId);
        prevTrack && prevTrack.stop();
    });

    useEffect(() => {
        if (withInitialVideo) {
            requestCameraCapture();
        }
        if (withInitialAudio) {
            requestAudioCapture();
        }
    }, []);

    return {
        mediaStream,
        hasAudioCapture: !!audioCaptureId$.current,
        hasCameraCapture: !!cameraCaptureId$.current,
        hasScreenCapture: !!screenCaptureId$.current,
        requestScreenCapture,
        requestCameraCapture,
        requestAudioCapture,
        stopScreenCapture,
        stopCameraCapture,
        stopAudioCapture,
    };
};

export default useMediaStreamBuilder;
