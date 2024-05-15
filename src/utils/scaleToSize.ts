import { scaleRect } from "./scaleRect";

const MIME_TYPE = "image/jpeg";
const QUALITY = 0.8;
const MAX_SIZE = 20 * 1024 * 1024;

const compressImage = (blob: Blob) =>
    new Promise<Blob>((res, rej) => {
      const img = new Image();
      const src = URL.createObjectURL(blob);
      img.src = src;
      img.onerror = function () {
        URL.revokeObjectURL(src);
        rej(new Error("react-declarative compressImage load error"));
      };
      img.onload = function () {
        URL.revokeObjectURL(src);
        const { height, width } = scaleRect({
          height: img.naturalHeight,
          width: img.naturalWidth,
        });
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("react-declarative compressImage null canvas ctx");
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                rej(new Error("react-declarative compressImage null blob"));
                return;
              }
              res(blob);
            },
            MIME_TYPE,
            QUALITY,
          );
        } catch (error) {
          console.error(error);
          rej(new Error("react-declarative compressImage unknown error"));
        }
      };
    });

export const createScaleToSize = (maxSize = MAX_SIZE) => async (blob: File | Blob) => {
  try {
    if (blob.size > maxSize) {
      return await compressImage(blob);
    }
  } catch (error) {
    console.error(`react-declarative compressImage error`, error);
  }
  return blob;
};

export const scaleToSize = createScaleToSize();

export default scaleToSize;
