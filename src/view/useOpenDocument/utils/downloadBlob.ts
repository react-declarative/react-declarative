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
    onProgress?: (progress: number) => void
  }
) =>
  new Promise<Blob>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress && onProgress((event.loaded / event.total) * 100);
      } else if (sizeOriginal) {
        onProgress && onProgress(Math.min((event.loaded / sizeOriginal) * 100, 100));
      } else {
        console.log('downloadBlob file length is not computable');
      }
      return;
    });
    xhr.addEventListener("error", () => {
      rej();
    });
    xhr.addEventListener("loadend", () => {
      onProgress && onProgress(100);
      if (xhr.status !== 200) {
        rej(new Error("downloadBlob status !== 200"));
        return;
      }
      if (xhr.readyState === 4) {
        res(xhr.response);
        return;
      }
    });
    xhr.responseType = "blob";
    xhr.open("GET", url, true);
    xhr.send();
  });

export default downloadBlob;
