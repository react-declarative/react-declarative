/**
 * A singleton class for handling audio recording using the MediaRecorder API.
 */
export class AudioMediaRecorder {
    /**
     * The singleton instance of AudioMediaRecorder.
     */
    private static instance: AudioMediaRecorder;

    /**
     * Retrieves the singleton instance of AudioMediaRecorder.
     * @returns The singleton instance of AudioMediaRecorder.
     */
    static getInstance(): AudioMediaRecorder {
        if (!this.instance) {
            this.instance = new AudioMediaRecorder();
        }
        return this.instance;
    }

    /**
     * The MediaRecorder instance.
     */
    private md?: MediaRecorder;

    /**
     * An array to store recorded chunks.
     */
    private recordChunks: Blob[];

    /**
     * Constructs an instance of AudioMediaRecorder.
     * Throws an error if window.MediaRecorder is undefined.
     */
    constructor() {
        if (!window.MediaRecorder) {
            throw new Error('window.MediaRecorder is undefined');
        }
        this.recordChunks = [];
    }

    /**
     * Initializes the MediaRecorder instance.
     * @returns A Promise resolving to the initialized AudioMediaRecorder instance.
     */
    async initialize(): Promise<AudioMediaRecorder> {
        if (this.md) {
            return this;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        this.md = new MediaRecorder(stream);
        this.recordChunks = [];
        return this;
    }

    /**
     * Starts recording audio.
     * @returns A Promise resolving when recording starts.
     * @throws Throws an error if the MediaRecorder instance is not initialized.
     */
    async startRecord(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.md) {
                throw new Error('Must be initialized.');
            }
            this.recordChunks = [];
            this.md.addEventListener('start', () => {
                resolve();
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.md.addEventListener('dataavailable', (e: BlobEvent) => {
                if (e.data.size > 0) {
                    this.recordChunks.push(e.data);
                }
            });
            this.md.start();
        });
    }

    /**
     * Stops recording audio.
     * @returns A Promise resolving to the recorded audio Blob.
     * @throws Throws an error if the MediaRecorder instance is not initialized.
     */
    async stopRecord(): Promise<Blob> {
        return new Promise((resolve) => {
            if (!this.md) {
                throw new Error('Must be initialized.');
            }
            this.md.addEventListener('stop', () => {
                resolve(new Blob(this.recordChunks));
            });
            this.md.stop();
        });
    }
}

export default AudioMediaRecorder;
