import * as React from 'react';
import { useState, useLayoutEffect, useRef } from 'react';

import classNames from '../../../utils/classNames';
import waitForSize from '../../../utils/wairForSize';

import { makeStyles, useTheme } from '../../../styles';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';

import { IWrappedLayout, PickProp } from '../../../model/IManaged';

import AutoSizer from '../../../components/AutoSizer';
import Group, { IGroupProps } from '../../../components/common/Group';

import { ISizeCallback } from '../../../model/ISize';
import IEntity from '../../../model/IEntity';

import makeLayout from '../components/makeLayout/makeLayout';

const DEFAULT_MARGIN = '0px';
const DEFAULT_SIZE = '100%';
const DEFAULT_E_SIZE = 'unset';

const GRID_MAX_WIDTH = 9999999999999999;
const FIELD_NEVER_MARGIN = '0';

interface IHeroTop<Data = IAnything, Payload = IAnything>  {
  top?: PickProp<IField<Data, Payload>, 'top'>;
  phoneTop?: PickProp<IField<Data, Payload>, 'phoneTop'>;
  tabletTop?: PickProp<IField<Data, Payload>, 'tabletTop'>;
  desktopTop?: PickProp<IField<Data, Payload>, 'desktopTop'>;
}

interface IHeroLeft<Data = IAnything, Payload = IAnything>  {
  left?: PickProp<IField<Data, Payload>, 'left'>;
  phoneLeft?: PickProp<IField<Data, Payload>, 'phoneLeft'>;
  tabletLeft?: PickProp<IField<Data, Payload>, 'tabletLeft'>;
  desktopLeft?: PickProp<IField<Data, Payload>, 'desktopLeft'>;
}

interface IHeroRight<Data = IAnything, Payload = IAnything>  {
  right?: PickProp<IField<Data, Payload>, 'right'>;
  phoneRight?: PickProp<IField<Data, Payload>, 'phoneRight'>;
  tabletRight?: PickProp<IField<Data, Payload>, 'tabletRight'>;
  desktopRight?: PickProp<IField<Data, Payload>, 'desktopRight'>;
}

interface IHeroBottom<Data = IAnything, Payload = IAnything>  {
  bottom?: PickProp<IField<Data, Payload>, 'bottom'>;
  phoneBottom?: PickProp<IField<Data, Payload>, 'phoneBottom'>;
  tabletBottom?: PickProp<IField<Data, Payload>, 'tabletBottom'>;
  desktopBottom?: PickProp<IField<Data, Payload>, 'desktopBottom'>;
}

interface IHeroHeight<Data = IAnything, Payload = IAnything>  {
  height?: PickProp<IField<Data, Payload>, 'height'>;
  phoneHeight?: PickProp<IField<Data, Payload>, 'phoneHeight'>;
  tabletHeight?: PickProp<IField<Data, Payload>, 'tabletHeight'>;
  desktopHeight?: PickProp<IField<Data, Payload>, 'desktopHeight'>;
}

interface IHeroMinHeight<Data = IAnything, Payload = IAnything>  {
  minHeight?: PickProp<IField<Data, Payload>, 'minHeight'>;
  phoneMinHeight?: PickProp<IField<Data, Payload>, 'phoneMinHeight'>;
  tabletMinHeight?: PickProp<IField<Data, Payload>, 'tabletMinHeight'>;
  desktopMinHeight?: PickProp<IField<Data, Payload>, 'desktopMinHeight'>;
}

interface IHeroMaxHeight<Data = IAnything, Payload = IAnything>  {
  maxHeight?: PickProp<IField<Data, Payload>, 'maxHeight'>;
  phoneMaxHeight?: PickProp<IField<Data, Payload>, 'phoneMaxHeight'>;
  tabletMaxHeight?: PickProp<IField<Data, Payload>, 'tabletMaxHeight'>;
  desktopMaxHeight?: PickProp<IField<Data, Payload>, 'desktopMaxHeight'>;
}

interface IHeroWidth<Data = IAnything, Payload = IAnything>  {
  width?: PickProp<IField<Data, Payload>, 'width'>;
  phoneWidth?: PickProp<IField<Data, Payload>, 'phoneWidth'>;
  tabletWidth?: PickProp<IField<Data, Payload>, 'tabletWidth'>;
  desktopWidth?: PickProp<IField<Data, Payload>, 'desktopWidth'>;
}

interface IHeroMinWidth<Data = IAnything, Payload = IAnything>  {
  minWidth?: PickProp<IField<Data, Payload>, 'minWidth'>;
  phoneMinWidth?: PickProp<IField<Data, Payload>, 'phoneMinWidth'>;
  tabletMinWidth?: PickProp<IField<Data, Payload>, 'tabletMinWidth'>;
  desktopMinWidth?: PickProp<IField<Data, Payload>, 'desktopMinWidth'>;
}

interface IHeroMaxWidth<Data = IAnything, Payload = IAnything>  {
  maxWidth?: PickProp<IField<Data, Payload>, 'maxWidth'>;
  phoneMaxWidth?: PickProp<IField<Data, Payload>, 'phoneMaxWidth'>;
  tabletMaxWidth?: PickProp<IField<Data, Payload>, 'tabletMaxWidth'>;
  desktopMaxWidth?: PickProp<IField<Data, Payload>, 'desktopMaxWidth'>;
}

interface IHeroStyle<Data = IAnything, Payload = IAnything>  {
  heroOuterStyle?: PickProp<IField<Data, Payload>, 'heroOuterStyle'>;
  heroOuterPhoneStyle?: PickProp<IField<Data, Payload>, 'heroOuterPhoneStyle'>;
  heroOuterTabletStyle?: PickProp<IField<Data, Payload>, 'heroOuterTabletStyle'>;
  heroOuterDesktopStyle?: PickProp<IField<Data, Payload>, 'heroOuterDesktopStyle'>;
  heroInnerStyle?: PickProp<IField<Data, Payload>, 'heroInnerStyle'>;
  heroInnerPhoneStyle?: PickProp<IField<Data, Payload>, 'heroInnerPhoneStyle'>;
  heroInnerTabletStyle?: PickProp<IField<Data, Payload>, 'heroInnerTabletStyle'>;
  heroInnerDesktopStyle?: PickProp<IField<Data, Payload>, 'heroInnerDesktopStyle'>;
}

type IHeroRegistry<D = IAnything> = 
  IHeroTop<D>
    & IHeroLeft<D>
    & IHeroRight<D>
    & IHeroBottom<D>
    & IHeroWidth<D>
    & IHeroMinWidth<D>
    & IHeroMaxWidth<D>
    & IHeroHeight<D>
    & IHeroMinHeight<D>
    & IHeroMaxHeight<D>
    & IHeroStyle<D>;

const useStyles = makeStyles()({
  root: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  container: {
    flexGrow: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  item: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    '& > *': {
      flexGrow: 1,
    },
  },
});

type Group<Data = IAnything> = Omit<IGroupProps<Data>, keyof {
  fieldRightMargin: never;
  fieldBottomMargin: never;
}>;

export interface IHeroLayoutProps<Data = IAnything, Payload = IAnything> extends IHeroRegistry<Data>, Group<Data>, IWrappedLayout<Data> {
  className?: PickProp<IField<Data, Payload>, 'className'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
  object: PickProp<IEntity<Data>, 'object'>;
}

interface IHeroLayoutPrivate {
  children?: React.ReactNode;
}

interface IBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface IContainerProps<Data extends IAnything> {
  children: React.ReactNode;
  className: string;
  bpoints: IBreakpoints;
  height: number;
  width: number;
  registry: IHeroRegistry<Data>;
  object: PickProp<IEntity<Data>, 'object'>;
  element: HTMLDivElement;
}

const match = (from: number, to: number) => matchMedia(`(min-width: ${from}px) and (max-width: ${to}px)`).matches;

const getScreenInfo = ({
  xs = 0,
  sm = 600,
  // md = 960,
  lg = 1280,
  // xl = 1536,
}: IBreakpoints) => ({
  isPhone: match(xs, sm),
  isTablet: match(sm, lg),
  isDesktop: match(lg, GRID_MAX_WIDTH),
});

const Container = <Data extends IAnything>({
  className,
  bpoints,
  height,
  width,
  registry,
  children,
  object,
  element,
}: IContainerProps<Data>) => {

  const [outerStyles, setOuterStyles] = useState<React.CSSProperties>({});
  const [innerStyles, setInnerStyles] = useState<React.CSSProperties>({});

  const {
    isDesktop,
    isTablet,
    isPhone,
  } = getScreenInfo(bpoints);
  
  const isMounted = useRef(true);

  useLayoutEffect(() => () => {
    isMounted.current = false;
  }, []);

  useLayoutEffect(() => {

    const process = async () => {

      const outerStyles: React.CSSProperties = {
        ...(isDesktop && (registry.heroOuterDesktopStyle || registry.heroOuterStyle)),
        ...(isTablet && (registry.heroOuterTabletStyle || registry.heroOuterStyle)),
        ...(isPhone && (registry.heroOuterPhoneStyle || registry.heroOuterStyle)),
        ...(!isPhone && !isTablet && !isDesktop && registry.heroOuterStyle),
      };

      const innerStyles: React.CSSProperties = {
        ...(isDesktop && (registry.heroInnerDesktopStyle || registry.heroInnerStyle)),
        ...(isTablet && (registry.heroInnerTabletStyle || registry.heroInnerStyle)),
        ...(isPhone && (registry.heroInnerPhoneStyle || registry.heroInnerStyle)),
        ...(!isPhone && !isTablet && !isDesktop && registry.heroInnerStyle),
      };

      await waitForSize(element);

      const res = (value: ISizeCallback<Data> | string) => {
        if (typeof value === 'function') {
          const { height, width } = element.getBoundingClientRect();
          return value(object, { height, width }, element);
        } else {
          return value;
        }
      };

      if (isDesktop) {
        outerStyles.minHeight = res(registry.desktopMinHeight || registry.minHeight || DEFAULT_E_SIZE);
        outerStyles.maxHeight = res(registry.desktopMaxHeight || registry.maxHeight || DEFAULT_E_SIZE);
        outerStyles.minWidth = res(registry.desktopMinWidth || registry.minWidth || DEFAULT_E_SIZE);
        outerStyles.maxWidth = res(registry.desktopMaxWidth || registry.maxWidth || DEFAULT_E_SIZE);
        outerStyles.height = res(registry.desktopHeight || registry.height || DEFAULT_SIZE);
        outerStyles.width = res(registry.desktopWidth || registry.width || DEFAULT_SIZE);
        innerStyles.top =  res(registry.desktopTop || registry.top || DEFAULT_MARGIN);
        innerStyles.left = res(registry.desktopLeft || registry.left || DEFAULT_MARGIN);
        innerStyles.right = res(registry.desktopRight || registry.right || DEFAULT_MARGIN);
        innerStyles.bottom = res(registry.desktopBottom || registry.bottom || DEFAULT_MARGIN);
      } else if (isTablet) {
        outerStyles.minHeight = res(registry.tabletMinHeight || registry.minHeight || DEFAULT_E_SIZE);
        outerStyles.maxHeight = res(registry.tabletMaxHeight || registry.maxHeight || DEFAULT_E_SIZE);
        outerStyles.minWidth = res(registry.tabletMinWidth || registry.minWidth || DEFAULT_E_SIZE);
        outerStyles.maxWidth = res(registry.tabletMaxWidth || registry.maxWidth || DEFAULT_E_SIZE);
        outerStyles.height = res(registry.tabletHeight || registry.height || DEFAULT_SIZE);
        outerStyles.width = res(registry.tabletWidth || registry.width || DEFAULT_SIZE);
        innerStyles.top =  res(registry.tabletTop || registry.top || DEFAULT_MARGIN);
        innerStyles.left = res(registry.tabletLeft || registry.left || DEFAULT_MARGIN);
        innerStyles.right = res(registry.tabletRight || registry.right || DEFAULT_MARGIN);
        innerStyles.bottom = res(registry.tabletBottom || registry.bottom || DEFAULT_MARGIN);
      } else if (isPhone) {
        outerStyles.minHeight = res(registry.phoneMinHeight || registry.minHeight || DEFAULT_E_SIZE);
        outerStyles.maxHeight = res(registry.phoneMaxHeight || registry.maxHeight || DEFAULT_E_SIZE);
        outerStyles.minWidth = res(registry.phoneMinWidth || registry.minWidth || DEFAULT_E_SIZE);
        outerStyles.maxWidth = res(registry.phoneMaxWidth || registry.maxWidth || DEFAULT_E_SIZE);
        outerStyles.height = res(registry.phoneHeight || registry.height || DEFAULT_SIZE);
        outerStyles.width = res(registry.phoneWidth || registry.width || DEFAULT_SIZE);
        innerStyles.top =  res(registry.phoneTop || registry.top || DEFAULT_MARGIN);
        innerStyles.left = res(registry.phoneLeft || registry.left || DEFAULT_MARGIN);
        innerStyles.right = res(registry.phoneRight || registry.right || DEFAULT_MARGIN);
        innerStyles.bottom = res(registry.phoneBottom || registry.bottom || DEFAULT_MARGIN);
      } else {
        throw new Error('HeroLayout invalid media query');
      }

      if (isMounted.current) {
        setOuterStyles(outerStyles);
        setInnerStyles(innerStyles);
      }

    };

    process();

  }, [
    object,
    width,
    height,
    element,
    registry.top,
    registry.phoneTop,
    registry.tabletTop,
    registry.desktopTop,
    registry.left,
    registry.phoneLeft,
    registry.tabletLeft,
    registry.desktopLeft,
    registry.right,
    registry.phoneRight,
    registry.tabletRight,
    registry.desktopRight,
    registry.bottom,
    registry.phoneBottom,
    registry.tabletBottom,
    registry.desktopBottom,
    registry.height,
    registry.phoneHeight,
    registry.tabletHeight,
    registry.desktopHeight,
    registry.minWidth,
    registry.phoneMinWidth,
    registry.tabletMinWidth,
    registry.desktopMinWidth,
    registry.maxWidth,
    registry.phoneMaxWidth,
    registry.tabletMaxWidth,
    registry.desktopMaxWidth,
  ]);

  return (
    <div
      style={outerStyles}
    >
      <div
        className={className}
        style={innerStyles}
      >
        {children}
      </div>
    </div>
  );
};

export const HeroLayout = <Data extends IAnything = IAnything>({
  children,
  className,
  style,
  object,
  columns,
  columnsOverride,
  sx,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  ...otherProps
}: IHeroLayoutProps<Data> & IHeroLayoutPrivate) => {
  const { breakpoints: { values: bpoints } } = useTheme();
  const groupRef: React.MutableRefObject<any> = useRef(null);
  const { classes } = useStyles();
  return (
    <Group
      className={classNames(className, classes.root)}
      ref={(el) => groupRef.current = el}
      style={style}
      isItem={true}
      columns={columns}
      phoneColumns={phoneColumns}
      tabletColumns={tabletColumns}
      desktopColumns={desktopColumns}
      fieldRightMargin={FIELD_NEVER_MARGIN}
      fieldBottomMargin={FIELD_NEVER_MARGIN}
    >
      <Group
        className={classes.container}
        columnsOverride={columnsOverride}
        sx={sx}
      >
        <AutoSizer
          className={classes.content}
          target={document.body}
          payload={object}
        >
          {({ width, height }) => width ? (
            <Container<Data>
              element={groupRef.current}
              className={classes.item}
              bpoints={bpoints}
              height={height}
              width={width}
              registry={otherProps}
              object={object}
            >
              {children}
            </Container>
          ) : null}
        </AutoSizer>
      </Group>
    </Group>
  );
};

HeroLayout.displayName = 'HeroLayout';

export default makeLayout(HeroLayout) as typeof HeroLayout;
