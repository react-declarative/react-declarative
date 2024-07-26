import React from "react";
import {
    RoiView,
    ICord,
} from "react-declarative";

const AREA_SRC = "/floor.jpg";

const cords: ICord[] = [
    {
        type: "rect",
        id: "c79b6bf1-c1aa-4889-8229-935daccd2aac",
        top: 106,
        left: 214,
        height: 190,
        width: 320,
        angle: 0,
        color: "green",
        label: "ROOM №1 ",
    },
];

export const App = () => {
    return (
        <RoiView
            src={AREA_SRC}
            cords={cords}
            onChange={(cords) => {
                console.log({ cords });
            }}
            onClick={(e, id) => alert(id)}
        />
    )
}

export default App;
