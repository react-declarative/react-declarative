import { rect, roi, square } from "../js/area-selector";

import ICord from "../model/ICord";

export const lowLevelCords = (cords: ICord[], naturalHeight = 100, naturalWidth = 100) => cords.map(({
    id, type, height, width, top, left, color
}) => type === 'rect' ? rect(id, top, left, height, width, color)
        : type === 'square' ? square(id, top, left, Math.max(height, width), color)
            : type === 'roi' ? roi(top, left, naturalWidth - left - width, naturalHeight - top - height, color)
                : console.error('lowLevelCords invalid cord type', type) as never
);

export default lowLevelCords;
