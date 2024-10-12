export const CONTROL_RECT = 'react-declarative__roiControlRect';
export const LABEL_RECT = 'react-declarative__roiAreaLabel';
export const AREA_RECT = 'react-declarative__roiAreaRect';

const debug = new class {
  log(...args) {
    void args;
    // console.log(...args);
  }
};

let RUN_OUTSIDE_ANGULAR = (c) => c();
let AREA_REFERENCE_CALLBACK = (id, ref) => debug.log({ id, ref });
let AREA_EVENT_CALLBACK = (id, type, ...args) => debug.log({ id, type, args });
let RESIZE_CALLBACK = (id, img) => debug.log({ id, img });
let AREA_READONLY_FLAG = false;

const createInitHandler = (fn) => {
  let isComplete = false;
  return () => {
    if (isComplete) {
      return;
    }
    fn();
    isComplete = true;
  }
};

const touchManager = new class {
  _wrappers = new Map();
  applyTouchWrapper(callback, passive = false) {
    const handler = (e) => {
      const {touches} = e;
      if (!passive) {
        e.preventDefault();
        e.stopPropagation();
      }
      callback(touches[0]);
    };
    this._wrappers.set(callback, handler);
    return handler;
  }
  disposeTouchWrapper(callback) {
    const wrapper = this._wrappers.get(callback);
    this._wrappers.delete(callback);
    return wrapper;
  }
}

const on = (ref, event, callback) => {
  if (AREA_READONLY_FLAG) {
    return;
  }
  if (event === 'mousemove') {
    const wrapped = touchManager.applyTouchWrapper(callback, true);
    ref.addEventListener('mousemove', callback);
    ref.addEventListener('touchmove', wrapped);
  } else if (event === 'mousedown') {
    const wrapped = touchManager.applyTouchWrapper(callback);
    ref.addEventListener('mousedown', callback);
    ref.addEventListener('touchstart', wrapped);
  } else if (event === 'mouseup') {
    const wrapped = touchManager.applyTouchWrapper(callback, true);
    ref.addEventListener('mouseup', callback);
    ref.addEventListener('touchend', wrapped);
  } else {
    throw new Error(`area-selector on unknown event: ${event}`);
  }
};

const un = (ref, event, callback) => {
  if (AREA_READONLY_FLAG) {
    return;
  }
  if (event === 'mousemove') {
    const wrapped = touchManager.disposeTouchWrapper(callback);
    ref.removeEventListener('mousemove', callback);
    ref.removeEventListener('touchmove', wrapped);
  } else if (event === 'mousedown') {
    const wrapped = touchManager.disposeTouchWrapper(callback);
    ref.removeEventListener('mousedown', callback);
    ref.removeEventListener('touchstart', wrapped);
  } else if (event === 'mouseup') {
    const wrapped = touchManager.disposeTouchWrapper(callback);
    ref.removeEventListener('mouseup', callback);
    ref.removeEventListener('touchend', wrapped);
  } else {
    throw new Error(`area-selector un unknown event: ${event}`);
  }
};

const createLabel = (text) => {
  const label = document.createElement('label');
  label.classList.add(LABEL_RECT);
  label.style.position = 'absolute';
  label.style.top = '50%';
  label.style.left = '50%';
  label.style.transform = 'translate(-50%, -50%)';
  label.style.userSelect = 'none';
  label.style.pointerEvents = 'none';
  label.innerText = text;
  return label;
};

function rotatePoint(px, py, cx, cy, angle) {
  const radians = angle * Math.PI / 180;
  
  // Translate point to origin
  const translatedX = px - cx;
  const translatedY = py - cy;
  
  // Perform rotation
  const rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
  const rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);
  
  // Translate point back to the original center
  const newX = rotatedX + cx;
  const newY = rotatedY + cy;
  
  return [newX, newY];
}

function getRotatePos([newTop, newLeft, newWidth, newHeight], [currentTop, currentLeft, currentWidth, currentHeight], angle) {
  if (!angle) {
    return [newTop, newLeft, newWidth, newHeight];
  }
  const widthDifference = newWidth - currentWidth;
  const heightDifference = newHeight - currentHeight;
  const topAdjustment = heightDifference / 2;
  const leftAdjustment = widthDifference / 2;
  const top = currentTop - topAdjustment;
  const left = currentLeft - leftAdjustment;
  return [top, left, newWidth, newHeight];
}

const getElementCenter = (element) => {
  const rect = element.getBoundingClientRect();
  const {scrollX, scrollY } = window;
  const centerX = rect.left + rect.width / 2 + scrollX;
  const centerY = rect.top + rect.height / 2 + scrollY;
  return [centerX, centerY];
};

const createRect = (
  RUN_OUTSIDE_ANGULAR = (c) => c(),
  AREA_EVENT_CALLBACK = (id, type, ...args) => debug.log({ id, type, args }),
  ID = 'unset',
  ENTITY_ID = 'unset-zone',
  TOP = 10,
  LEFT = 10,
  HEIGHT = 125,
  WIDTH = 125,
  ANGLE = 0,
  IMAGE_SRC = '',
  LINE_COLOR = 'cyan',
  LABEL = '',
  BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.5)',
) => {

  const { max, round } = Math;

  const area = document.createElement('div');

  if (ANGLE) {
    area.style.transform = `rotate(${ANGLE}deg)`;
  }

  area.classList.add(AREA_RECT);

  area.dataset.data_area_id = ID;

  let KX = 1.0 // width
  let KY = 1.0 // height

  const changed = (
    top = round(TOP / KY),
    left = round(LEFT / KX),
    width = round(WIDTH / KX),
    height = round(HEIGHT / KY),
  ) => AREA_EVENT_CALLBACK(ID, 'rect-area-changed', ENTITY_ID, top, left, height, width, ANGLE);

  if (AREA_READONLY_FLAG) {
    area.addEventListener('click', (e) => {
      AREA_EVENT_CALLBACK(ID, 'rect-area-click', ENTITY_ID, e);
    });
    area.addEventListener('mouseover', (e) => {
      e.stopPropagation();
      AREA_EVENT_CALLBACK(ID, 'rect-area-hover', ENTITY_ID, e);
    });
  }

  area.style.position = 'absolute';
  area.style.display = 'flex';
  area.style.alignItems = 'stretch';
  area.style.justifyContent = 'stretch';
  area.style.zIndex = '99';

  if (IMAGE_SRC) {
    area.style.backgroundRepeat = 'no-repeat';
    area.style.backgroundPosition = 'center';
    area.style.backgroundSize = 'contain';
    area.style.backgroundImage = `url('${IMAGE_SRC}')`;
  }

  area.style.backgroundColor = BACKGROUND_COLOR;
  area.style.border = `1px solid ${LINE_COLOR}`;

  const div = document.createElement('div');
  div.style.position = 'relative';
  div.style.flexGrow = '1';

  if (LABEL) {
    div.appendChild(createLabel(LABEL));
  }

  const redraw = (top = TOP, left = LEFT, width = WIDTH, height = HEIGHT) => {
    area.style.top = `${top}px`;
    area.style.left = `${left}px`;
    area.style.width = `${width}px`;
    area.style.height = `${height}px`;
    changed();
  };

  let resizing = false;

  const createControl = (topAnchor = true, leftAnchor = true) => {

    const control = document.createElement('div');

    control.classList.add(CONTROL_RECT);

    control.style.top = topAnchor ? '-4px' : null;
    control.style.left = leftAnchor ? '-4px' : null;
    control.style.right = leftAnchor ? null : '-4px';
    control.style.bottom = topAnchor ? null : '-4px';
    control.style.background = LINE_COLOR;
    control.style.position = 'absolute';
    control.style.height = '8px';
    control.style.width = '8px';

    let [x1, y1] = [null, null]; // mouse relative to image
    let [dx, dy] = [null, null]; // pos delta

    const dragHandler = ({ pageX, pageY }) => {

      if (AREA_READONLY_FLAG) {
        return;
      }

      const {scrollX, scrollY} = window;
      pageX -= scrollX;
      pageY -= scrollY;

      const [cx, cy] = getElementCenter(area);

      [pageX, pageY] = rotatePoint(pageX, pageY, cx, cy, -ANGLE);

      let areaHeight = null;
      let areaWidth = null;

      {
        const { top, left, height, width } = area.parentElement.getBoundingClientRect();
        areaHeight = height;
        areaWidth = width;
        [x1, y1] = [max(pageX - left, 0), max(pageY - top, 0)];
        [dx, dy] = [LEFT - x1, TOP - y1];
      }

      const moveTopLeft = () => getRotatePos([y1, x1, WIDTH + dx, HEIGHT + dy], [TOP, LEFT, WIDTH, HEIGHT], ANGLE);
      const moveTopRight = () => getRotatePos([y1, LEFT, x1 - LEFT, HEIGHT + dy], [TOP, LEFT, WIDTH, HEIGHT], ANGLE);
      const moveBottomLeft = () => getRotatePos([TOP, x1, WIDTH + dx, y1 - TOP], [TOP, LEFT, WIDTH, HEIGHT], ANGLE);
      const moveBottomRight = () => getRotatePos([TOP, LEFT, x1 - LEFT, y1 - TOP], [TOP, LEFT, WIDTH, HEIGHT], ANGLE);

      let [top, left, width, height] = [null, null, null, null];

      if (topAnchor && leftAnchor) {
        [top, left, width, height] = moveTopLeft();
      } else if (topAnchor && !leftAnchor) {
        [top, left, width, height] = moveTopRight();
      } else if (!topAnchor && leftAnchor) {
        [top, left, width, height] = moveBottomLeft();
      } else if (!topAnchor && !leftAnchor) {
        [top, left, width, height] = moveBottomRight();
      }

      if (top + height > areaHeight || left + width > areaWidth) {
        return;
      } else {
        TOP = height < 0 ? TOP : top;
        LEFT = width < 0 ? LEFT : left;
        WIDTH = width < 0 ? WIDTH : width;
        HEIGHT = height < 0 ? HEIGHT : height;
        redraw();
      }
    };

    RUN_OUTSIDE_ANGULAR(() => on(control, 'mousedown', () => {
      resizing = true;
      RUN_OUTSIDE_ANGULAR(() => on(window, 'mousemove', dragHandler));
      RUN_OUTSIDE_ANGULAR(() => on(window, 'mouseup', () => {
        RUN_OUTSIDE_ANGULAR(() => un(window, 'mousemove', dragHandler));
        resizing = false;
      }));
      return false;
    }));

    return control;
  };

  [[true, true], [true, false], [false, true], [false, false]]
    .map((cfg) => createControl(...cfg))
    .forEach((n) => div.appendChild(n));

  let [x1, y1] = [null, null]; // mouse relative to image
  let [dx, dy] = [null, null]; // pos delta

  const dragHandler = ({ pageX, pageY }) => {

    if (AREA_READONLY_FLAG) {
      return;
    }

    const {scrollX, scrollY} = window;
    pageX -= scrollX;
    pageY -= scrollY;

    {
      const { top, left } = area.parentElement.getBoundingClientRect();
      [x1, y1] = [max(pageX - left, 0), max(pageY - top, 0)];
      [dx, dy] = [LEFT - x1, TOP - y1];
    }

    const [top, left] = [max(y1 - (HEIGHT / 2), 0), max(x1 - (WIDTH / 2), 0)];
    const { height, width } = area.parentElement.getBoundingClientRect();

    if (resizing) {
      return;
    } else {
      TOP = top + HEIGHT > height ? TOP : top;
      LEFT = left + WIDTH > width ? LEFT : left;
      redraw();
    }
  };

  RUN_OUTSIDE_ANGULAR(() => on(area, 'mousedown', () => {
    RUN_OUTSIDE_ANGULAR(() => on(window, 'mousemove', dragHandler));
    RUN_OUTSIDE_ANGULAR(() => on(window, 'mouseup', () =>
      RUN_OUTSIDE_ANGULAR(() => un(window, 'mousemove', dragHandler))
    ));
    return false;
  }));

  const resize = ([image, area, root]) => {
    const { naturalWidth, naturalHeight } = image;
    const { width, height } = image.getBoundingClientRect();
    const [
      prevWidth,
      prevHeight,
      prevTop,
      prevLeft,
    ] = [WIDTH / KX, HEIGHT / KY, TOP / KY, LEFT / KX];
    KX = width / naturalWidth;
    KY = height / naturalHeight;
    HEIGHT = prevHeight * KY;
    WIDTH = prevWidth * KX;
    TOP = prevTop * KY;
    LEFT = prevLeft * KX;
    redraw();
  };

  area.appendChild(div);

  return [area, resize];
};

const createRoi = (
  RUN_OUTSIDE_ANGULAR = (c) => c(),
  AREA_EVENT_CALLBACK = (id, type, ...args) => debug.log({ id, type, args }),
  ID = 'unset',
  TOP = 10,
  LEFT = 10,
  RIGHT = 10,
  BOTTOM = 10,
  LINE_COLOR = 'blue',
  BORDER_COLOR = 'rgba(0, 0, 0, 0.5)',
) => {

  const { min, max, round } = Math;

  let KX = 1.0 // width
  let KY = 1.0 // height

  const changed = (
    top = round(TOP / KY),
    left = round(LEFT / KX),
    right = round(RIGHT / KX),
    bottom = round(BOTTOM / KY),
  ) => AREA_EVENT_CALLBACK(ID, 'roi-area-changed', top, left, right, bottom);

  const createArea = (
    top = TOP,
    left = LEFT,
    right = RIGHT,
    bottom = BOTTOM,
  ) => {

    const createContent = (rect) => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.top = '0px';
      div.style.left = '0px';
      div.style.right = '0px';
      div.style.bottom = '0px';
      div.style.display = 'flex';
      div.style.alignItems = 'stretch';
      div.style.justifyContent = 'stretch';
      const content = document.createElement('div');
      content.style.flexGrow = '1';
      content.style.position = 'relative';
      content.style.overflow = 'hidden';
      div.appendChild(content);
      rect.appendChild(div);
      return content;
    };

    const area = document.createElement('div');
    area.style.position = 'absolute';
    area.style.top = '0px';
    area.style.left = '0px';
    area.style.right = '0px';
    area.style.bottom = '0px';
    area.style.zIndex = '100';
    area.style.display = 'flex';
    area.style.alignItems = 'stretch';
    area.style.justifyContent = 'stretch';
    const setTop = (top, initial = false) => {
      area.style.borderTop = `${top}px solid ${BORDER_COLOR}`;
      TOP = top;
      if (!initial) {
        changed();
      }
    };
    const setLeft = (left, initial = false) => {
      area.style.borderLeft = `${left}px solid ${BORDER_COLOR}`
      LEFT = left;
      if (!initial) {
        changed();
      }
    };
    const setRight = (right, initial = false) => {
      area.style.borderRight = `${right}px solid ${BORDER_COLOR}`;
      RIGHT = right;
      if (!initial) {
        changed();
      }
    }
    const setBottom = (bottom, initial = false) => {
      area.style.borderBottom = `${bottom}px solid ${BORDER_COLOR}`;
      BOTTOM = bottom;
      if (!initial) {
        changed();
      }
    };
    [
      [setTop, top],
      [setLeft, left],
      [setRight, right],
      [setBottom, bottom],
    ].forEach(([c, v]) => (c)(v, true));
    const rect = document.createElement('div');
    rect.style.flexGrow = '1';
    rect.style.position = 'relative';
    rect.style.border = `1px solid ${LINE_COLOR}`;
    area.appendChild(rect);

    return [area, rect, createContent(rect), setTop, setLeft, setRight, setBottom];
  };

  const createControl = (
    topAnchor = true, leftAnchor = true,
    setHorizontal = (x) => debug.log(x),
    setVertical = (y) => debug.log(y),
  ) => {
    const control = document.createElement('div');

    control.classList.add(CONTROL_RECT);

    control.style.top = topAnchor ? '-4px' : null;
    control.style.left = leftAnchor ? '-4px' : null;
    control.style.right = leftAnchor ? null : '-4px';
    control.style.bottom = topAnchor ? null : '-4px';
    control.style.background = LINE_COLOR;
    control.style.position = 'absolute';
    control.style.height = '8px';
    control.style.width = '8px';

    let [x1, y1] = [null, null]; // mouse relative to image

    const dragHandler = ({ pageX, pageY }) => {

      if (AREA_READONLY_FLAG) {
        return;
      }

      const {scrollX, scrollY} = window;
      pageX -= scrollX;
      pageY -= scrollY;
      const { top, left, right, bottom, height, width } = area.getBoundingClientRect();
      x1 = max(leftAnchor ? min(pageX - left, width - RIGHT) : min(-1 * (pageX - right), width - LEFT), 0);
      y1 = max(topAnchor ? min(pageY - top, height - BOTTOM) : min(-1 * (pageY - bottom), height - TOP), 0);
      setHorizontal(x1);
      setVertical(y1);
    };

    RUN_OUTSIDE_ANGULAR(() => on(control, 'mousedown', () => {
      RUN_OUTSIDE_ANGULAR(() => on(window, 'mousemove', dragHandler));
      RUN_OUTSIDE_ANGULAR(() => on(window, 'mouseup', () =>
        RUN_OUTSIDE_ANGULAR(() => un(window, 'mousemove', dragHandler))
      ));
      return false;
    }));

    return control;
  };

  const [area, rect, content, setTop, setLeft, setRight, setBottom] = createArea();
  const [topLeft, topRight, bottomLeft, bottomRight] = [
    [true, true, setLeft, setTop],
    [true, false, setRight, setTop],
    [false, true, setLeft, setBottom],
    [false, false, setRight, setBottom],
  ].map((cfg) => createControl(...cfg));
  [topLeft, topRight, bottomLeft, bottomRight].forEach((node) => rect.appendChild(node));

  const resize = ([image, area, root]) => {
    const { naturalWidth, naturalHeight } = image;
    const { width, height } = image.getBoundingClientRect();
    const [prevTop, prevLeft, prevRight, prevBottom] = [
      TOP / KY,
      LEFT / KX,
      RIGHT / KX,
      BOTTOM / KY,
    ];
    KX = width / naturalWidth;
    KY = height / naturalHeight;
    TOP = prevTop * KY;
    LEFT = prevLeft * KX;
    RIGHT = prevRight * KX;
    BOTTOM = prevBottom * KY;
    setTop(TOP, true);
    setLeft(LEFT, true);
    setRight(RIGHT, true);
    setBottom(BOTTOM, true);
    changed();
  };

  return [area, resize, content];
}

const AREA_SELECTORS = {
  roi: createRoi,
  rect: createRect,
};

const resizeHandler = ([img, area, root]) => {
  const rootHeight = root.getBoundingClientRect().height;
  const imgHeight = img.getBoundingClientRect().height;
  const margin = (rootHeight - imgHeight) / 2;
  area.style.height = `${imgHeight}px`;
  area.style.top = `${margin}px`;
  img.style.top = `${margin}px`;
};

const proxy = (callbackObj, set = null) => ({
  set: (target, prop, value) => {
    const keys = set ? set : new Set(Object.keys(callbackObj));
    if (keys.has(prop)) {
      target[prop] = value;
      callbackObj[prop](value);
    } else {
      target[prop] = value;
    }
    return true;
  }
});

const createControlObject = ({
  setControls = (types) => debug.log({ types }),
  obj = {
    controls: [],
  }
}) => new Proxy(Object.assign({}, obj), proxy({
  controls: setControls,
}, new Set(Object.keys(obj))));

const cleanup = (node) => {
  while (true) {
    const lastChild = node.lastChild;
    if (lastChild) {
      node.removeChild(lastChild);
    } else {
      break;
    }
  }
};

const waitForSize = (img, runOutsideAngular = RUN_OUTSIDE_ANGULAR) => new Promise((res) => {
  const check = () => {
    const { naturalWidth, naturalHeight } = img;
    const { width, height } = img.getBoundingClientRect();
    return naturalHeight && naturalWidth && height && width;
  };
  const interval = runOutsideAngular(() => setInterval(() => {
    if (check()) {
      clearInterval(interval);
      res();
    }
  }, 50));
});

function AreaSelector(resize = resizeHandler) {

  const self = Reflect.construct(HTMLElement, [], AreaSelector);

  // tslint:disable-next-line: new-parens
  const resizePipeline = new class {
    composes = [resize];
    cleanup = () => this.composes = [resize];
    addHandler = (r) => this.composes.push(r);
    exec = ([i, a, r]) => this.composes.reduce((acm, cur) => ([i, a, r]) => {
      acm([i, a, r]);
      cur([i, a, r]);
    })([i, a, r]);
  };

  let IMAGE_SOURCE = '';
  let HEIGHT = '100%';
  let WIDTH = '100%';
  let ID = 'unset';

  ID = self.hasAttribute('id') ? self.getAttribute('id') : ID;
  HEIGHT = self.hasAttribute('height') ? self.getAttribute('height') : HEIGHT;
  WIDTH = self.hasAttribute('width') ? self.getAttribute('width') : WIDTH;
  IMAGE_SOURCE = self.hasAttribute('imageSrc') ? self.getAttribute('imageSrc') : IMAGE_SOURCE;

  const root = document.createElement('div');
  root.style.position = 'relative';
  root.style.height = HEIGHT;
  root.style.width = WIDTH;

  const img = document.createElement('img');
  img.onload = () => {
    resizePipeline.exec([img, area, root]);
  };
  img.style.touchAction = 'none';
  img.style.pointerEvents = 'none';
  img.style.position = 'absolute';
  img.crossOrigin = 'anonymous';
  img.style.width = '100%';
  img.style.zIndex = '97';
  img.src = IMAGE_SOURCE;

  const area = document.createElement('div');
  area.style.position = 'relative';
  area.style.width = '100%';
  area.style.zIndex = '98';
  area.style.left = '0px';

  const initHandler = createInitHandler(() => {
    if (AREA_READONLY_FLAG) {
      area.addEventListener('mouseover', (e) => {
        e.stopPropagation();
        AREA_EVENT_CALLBACK(ID, 'root-area-hover', "", e)
      });
    }  
  });

  resizePipeline.addHandler(initHandler)

  const observer = new ResizeObserver(() => resizePipeline.exec([img, area, root]));
  RUN_OUTSIDE_ANGULAR(() => observer.observe(root));
  RUN_OUTSIDE_ANGULAR(() => observer.observe(img));

  self.appendChild(root);
  root.appendChild(area);
  root.appendChild(img);

  const disposeHandler = () => {
    if (!document.body.contains(root) && img.parentElement) {
      observer.unobserve(root);
      observer.unobserve(img);
      img.src = '#';
      img.parentElement.removeChild(img);
      debug.log('dispose');
    }
  };

  const setControls = async (controls) => {
    area.style.visibility = 'hidden';
    cleanup(area);
    resizePipeline.cleanup();
    for (const [type, ...args] of controls.sort(([a]) => a === 'roi' ? -1 : 1)) {
      const ref = AREA_SELECTORS[type];
      let [node, resize] = [null, null];
      if (ref) {
        [node, resize] = ref(RUN_OUTSIDE_ANGULAR, AREA_EVENT_CALLBACK, ID, ...args);
      } else {
        throw new Error('area-selector control not found ' + type);
      }
      resizePipeline.addHandler(resize);
      area.appendChild(node);
    }
    await waitForSize(img);
    resizePipeline.addHandler(([img]) => RESIZE_CALLBACK(ID, img));
    resizePipeline.addHandler(disposeHandler);
    resizePipeline.exec([img, area, root]);
    area.style.visibility = 'visible';
  };

  RUN_OUTSIDE_ANGULAR(() => setTimeout(() => AREA_REFERENCE_CALLBACK(ID, createControlObject({ setControls }))));

  return self;
}

/**
 * areaSelector((id, ref) => {
 *   ref.controls = [
 *     ['roi', 20, 20, 20, 20],
 *     ['rect', 'min-face', '', 50, 50, 125]
 *   ];
 * });
 * document.body.innerHTML = '<react-declarative-area-selector id="some-id" imageSrc="image.png"></area-selector>';
 */
export function areaSelector({
  areaRef = AREA_REFERENCE_CALLBACK,
  areaEvent = AREA_EVENT_CALLBACK,
  runRef = RUN_OUTSIDE_ANGULAR,
  resizeCallback = RESIZE_CALLBACK,
  readonlyFlag = AREA_READONLY_FLAG,
}) {
  AREA_REFERENCE_CALLBACK = areaRef;
  AREA_EVENT_CALLBACK = areaEvent;
  RESIZE_CALLBACK = resizeCallback;
  RUN_OUTSIDE_ANGULAR = runRef;
  AREA_READONLY_FLAG = readonlyFlag;
}

export const rect = (
  entityId = 'rect-unset-id',
  top = 10,
  left = 10,
  height = 125,
  width = 125,
  angle = 0,
  lineColor = 'cyan',
  label = "",
  imageSrc = '',
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
) => [
    'rect', entityId, top, left, height, width, angle, imageSrc, lineColor, label, backgroundColor
  ];

export const roi = (
  top = 10,
  left = 10,
  right = 10,
  bottom = 10,
  lineColor = 'blue',
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
) => [
    'roi', top, left, right, bottom, lineColor, backgroundColor,
  ];

if ("HTMLElement" in globalThis) {
  AreaSelector.prototype = Object.create(HTMLElement.prototype);
  customElements.define('react-declarative-area-selector', AreaSelector);
}
