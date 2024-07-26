import * as React from 'react';
import { useRef, useLayoutEffect } from 'react';

import { makeStyles } from '../../../styles';

import { areaSelector } from '../js/area-selector';

import useCordCache from '../hooks/useCordCache';

import ICord, { ICordInternal } from '../model/ICord';

import lowLevelCords from '../utils/lowLevelCords';

const useStyles = makeStyles()({
  parent: {
    position: 'relative',
  },
});

interface ISelectorProps {
  src: string;
  id: string;
  readonly: boolean;
  cords: ICord[];
  naturalHeight: number;
  naturalWidth: number;
  onChange: (cord: ICordInternal) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  onHover?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
}

export const Selector = ({
  src = 'image.png',
  id = 'unset',
  cords: upperCords = [],
  readonly,
  naturalHeight,
  naturalWidth,
  onChange,
  onClick,
  onHover,
}: ISelectorProps) => {
  const { classes } = useStyles();

  const parentRef = useRef<HTMLDivElement>(null as never);
  const mountRef = useRef(true);

  const cordManager = useCordCache(upperCords);

  const cords = cordManager.getValue();

  useLayoutEffect(() => {
    const {current} = parentRef;
    current.innerHTML = `
      <react-declarative-area-selector
        imageSrc="${src}"
        id="${id}">
      </react-declarative-area-selector>
    `;
    const roi = (args: any[]) => {
      const [top, left, right, bottom] = args;
      const {current} = mountRef;
      if (current) {
        const dto: ICordInternal = {
          type: 'roi', id: 'roi', 
          top, 
          left,
          height: naturalHeight - top - bottom,
          width: naturalWidth - left - right,
        };
        cordManager.commitChange(dto);
        onChange(dto);
      }
    };
    const rect = (args: any[]) => {
      const [id, top, left, height, width] = args;
      const {current} = mountRef;
      if (current) {
        const dto: ICordInternal = { type: 'rect', id, top, left, height, width };
        cordManager.commitChange(dto);
        onChange(dto);
      }
    };
    const square = (args: any[]) => {
      const [id, top, left, side] = args;
      const [height, width] = [...new Array(2)].map(() => side);
      const {current} = mountRef;
      if (current) {
        const dto: ICordInternal = {type: 'square', id, top, left, height, width};
        cordManager.commitChange(dto);
        onChange(dto);
      }
    };
    const click = (args: any[]) => {
      const [id, e] = args;
      onClick && onClick(e, id);
    };
    const hover = (args: any[]) => {
      const [id, e] = args;
      onHover && onHover(e, id);
    };
    areaSelector({
      areaRef: (refId, ref) => {
        if (refId === id) {
          ref.controls = lowLevelCords(cords, naturalHeight, naturalWidth);
        }
      },
      areaEvent: (refId, type, ...args) => {
        if (refId === id) {
          switch (type) {
            case 'rect-area-changed':
              rect(args);
              break;
            case 'roi-area-changed':
              roi(args);
              break;
            case 'square-area-changed':
              square(args);
              break;
            case 'rect-area-click':
              click(args);
              break;
            case 'square-area-click': 
              click(args);
              break;
            case 'rect-area-hover':
              hover(args);
              break;
            case 'square-area-hover': 
              hover(args);
              break;
            case 'root-area-hover': 
              hover(args);
              break;
            default:
              throw new Error('Selector unknown event type');
          }
        }
      },
      readonlyFlag: readonly,
    });
    mountRef.current = true;
    return () => {
      mountRef.current = false
    };
  }, [src, id, cords]);

  return (
    <div className={classes.parent} ref={parentRef}>
      <img src={src}/>
    </div>
  );
};

export default Selector;
