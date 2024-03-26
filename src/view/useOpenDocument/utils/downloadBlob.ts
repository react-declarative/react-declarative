/**
 * Downloads a blob from the specified URL.
 *
 * @param url - The URL of the blob to download.
 * @param [onProgress] - A callback function to be called with the download progress (0-100).
 * @returns - A promise that resolves with the downloaded blob.
 * @throws {Error} - If the download fails with a non-200 status code.
 */
export const downloadBlob = (
  url: string,
  {
    sizeOriginal,
    onProgress,
  }: {
    sizeOriginal?: number;
    onProgress?: (progress: number) => void;
  }
) =>
  new Promise<Blob>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener(
      "progress",
      /**
       * Updates the progress based on the event object.
       *
       * @param event - The event object containing information about the progress.
       * @param sizeOriginal - The original size of the file being downloaded. Optional.
       * @param onProgress - The callback function to be called with the updated progress percentage.
       * @returns
       */
      (event) => {
        if (event.lengthComputable) {
          onProgress && onProgress((event.loaded / event.total) * 100);
        } else if (sizeOriginal) {
          onProgress &&
            onProgress(Math.min((event.loaded / sizeOriginal) * 100, 100));
        } else {
          console.log("downloadBlob file length is not computable");
        }
        return;
      }
    );
    xhr.addEventListener(
      "error",
      /**
       * Rejects a promise.
       *
       * @returns
       */
      (error) => {
        rej(error);
      }
    );
    xhr.addEventListener(
      "loadend",
      /**
       * Function to handle download progress and response for a XMLHttpRequest.
       *
       * @param onProgress - Optional callback function to track the progress of the download.
       * @param xhr - The XMLHttpRequest object used for the download.
       * @param res - The resolve function of the Promise used for the download.
       * @param rej - The reject function of the Promise used for the download.
       */
      () => {
        onProgress && onProgress(100);
        if (xhr.status !== 200) {
          rej(new Error("downloadBlob status !== 200"));
          return;
        }
        if (xhr.readyState === 4) {
          res(xhr.response);
          return;
        }
      }
    );
    /**
     * @param {XMLHttpRequest} xhr - The XMLHttpRequest object.
     * @param {string} responseType - The desired response type for the XMLHttpRequest.
     * @description Sets the response type for the given XMLHttpRequest object.
     * @returns {void}
     */
    xhr.responseType = "blob";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send();
  });

export default downloadBlob;
