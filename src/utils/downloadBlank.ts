import { fileTypeFromBlob } from "file-type/core";
import Subject from "./rx/Subject";

let overrideRef: ((url: string, name: string) => void) | null = null;

const emitSubject = new Subject<{ url: string; name: string; }>();

/**
 * Downloads a file from the given URL with the specified name.
 * If overrideRef is defined, it will be invoked before initiating the download.
 * The file will be downloaded in a new browser tab or window.
 *
 * @param url - The URL of the file to download.
 * @param name - The name to be used for the downloaded file.
 * @returns
 */
export const downloadBlank = async (url: string, name: string) => {
  await emitSubject.next({ url, name });
  if (overrideRef) {
    overrideRef(url, name);
    return;
  }
  fetch(url, {
    mode: 'no-cors'
  })
    .then((response) => response.blob())
    .then(async (blob) => {
      const blobType = await fileTypeFromBlob(blob);
      const type = blobType?.mime || blob.type;
      return new Blob([blob], { type });
    })
    .then((blob) => {
      const uri = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = uri;
      a.download = name;
      a.style.display = "none";
      a.target = "_blank";
      document.body.appendChild(a);
      a.addEventListener(
        "click",
        () =>
          queueMicrotask(() => {
            URL.revokeObjectURL(uri);
          }),
        {
          once: true,
        }
      );
      a.click();
    });
};

downloadBlank.override = (ref: (url: string, name: string) => void) => {
  overrideRef = ref;
};

downloadBlank.listen = (fn: (dto: { url: string; name: string }) => void) => emitSubject.subscribe(fn);

export default downloadBlank;
