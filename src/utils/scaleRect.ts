import ISize from "../model/ISize";

const DEFAULT_MAX_HEIGHT = 1_000;
const DEFAULT_MAX_WIDTH = 1_000;

interface IParams {
    maxHeight?: number;
    maxWidth?: number;
}

export const createScaleRect = ({
    maxHeight = DEFAULT_MAX_HEIGHT,
    maxWidth = DEFAULT_MAX_WIDTH,
}: IParams = {}) => ({
    height,
    width,
}: ISize): ISize => {
    const widthScale = width > maxWidth ? maxWidth / width : 1.0;
    const heightScale = height > maxHeight ? maxHeight / height : 1.0;
    const scale = Math.min(widthScale, heightScale);
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    return {
        width: scaledWidth,
        height: scaledHeight
    };
};

export const scaleRect = createScaleRect();

export default createScaleRect;
