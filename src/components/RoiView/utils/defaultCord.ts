import { v4 as uuid } from "uuid";

import color from "./color";

import ICord from "../model/ICord";

export const defaultCord = (type: "roi" | "rect", id = uuid()): ICord => ({
    type,
    id,
    top: 50,
    left: 50,
    width: 100,
    height: 100,
    color: color(),
    angle: 0,
    label: "",
});

export default defaultCord;
