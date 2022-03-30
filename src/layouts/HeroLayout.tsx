import * as React from 'react';
import { useState, useLayoutEffect, useRef } from 'react';

import classNames from '../utils/classNames';
import waitForSize from '../utils/wairForSize';

import { withTheme } from '@mui/styles';
import { makeStyles } from '../styles';
import { Theme } from '@mui/material';

import IField from '../model/IField';
import IAnything from '../model/IAnything';

import { PickProp } from '../model/IManaged';

import AutoSizer from '../components/common/AutoSizer';
import Group, { IGroupProps } from '../components/common/Group';

import { ISizeCallback } from '../model/ISize';
import IEntity from '../model/IEntity';

const DEFAULT_MARGIN = '0px';
const DEFAULT_SIZE = '100%';
const DEFAULT_E_SIZE = 'unset';

const GRID_MAX_WIDTH = 9999999999999999;
const FIELD_NEVER_MARGIN = '0';
const AUTOSIZER_DELAY = 500;

interface IHeroTop<Data = IAnything>  {
  top?: PickProp<IField<Data>, 'top'>;
  phoneTop?: PickProp<IField<Data>, 'phoneTop'>;
  tabletTop?: PickProp<IField<Data>, 'tabletTop'>;
  desktopTop?: PickProp<IField<Data>, 'desktopTop'>;
}

interface IHeroLeft<Data = IAnything>  {
  left?: PickProp<IField<Data>, 'left'>;
  phoneLeft?: PickProp<IField<Data>, 'phoneLeft'>;
  tabletLeft?: PickProp<IField<Data>, 'tabletLeft'>;
  desktopLeft?: PickProp<IField<Data>, 'desktopLeft'>;
}

interface IHeroRight<Data = IAnything>  {
  right?: PickProp<IField<Data>, 'right'>;
  phoneRight?: PickProp<IField<Data>, 'phoneRight'>;
  tabletRight?: PickProp<IField<Data>, 'tabletRight'>;
  desktopRight?: PickProp<IField<Data>, 'desktopRight'>;
}

interface IHeroBottom<Data = IAnything>  {
  bottom?: PickProp<IField<Data>, 'bottom'>;
  phoneBottom?: PickProp<IField<Data>, 'phoneBottom'>;
  tabletBottom?: PickProp<IField<Data>, 'tabletBottom'>;
  desktopBottom?: PickProp<IField<Data>, 'desktopBottom'>;
}

interface IHeroHeight<Data = IAnything>  {
  height?: PickProp<IField<Data>, 'height'>;
  phoneHeight?: PickProp<IField<Data>, 'phoneHeight'>;
  tabletHeight?: PickProp<IField<Data>, 'tabletHeight'>;
  desktopHeight?: PickProp<IField<Data>, 'desktopHeight'>;
}

interface IHeroMinHeight<Data = IAnything>  {
  minHeight?: PickProp<IField<Data>, 'minHeight'>;
  phoneMinHeight?: PickProp<IField<Data>, 'phoneMinHeight'>;
  tabletMinHeight?: PickProp<IField<Data>, 'tabletMinHeight'>;
  desktopMinHeight?: PickProp<IField<Data>, 'desktopMinHeight'>;
}

interface IHeroMaxHeight<Data = IAnything>  {
  maxHeight?: PickProp<IField<Data>, 'maxHeight'>;
  phoneMaxHeight?: PickProp<IField<Data>, 'phoneMaxHeight'>;
  tabletMaxHeight?: PickProp<IField<Data>, 'tabletMaxHeight'>;
  desktopMaxHeight?: PickProp<IField<Data>, 'desktopMaxHeight'>;
}

interface IHeroWidth<Data = IAnything>  {
  width?: PickProp<IField<Data>, 'width'>;
  phoneWidth?: PickProp<IField<Data>, 'phoneWidth'>;
  tabletWidth?: PickProp<IField<Data>, 'tabletWidth'>;
  desktopWidth?: PickProp<IField<Data>, 'desktopWidth'>;
}

interface IHeroMinWidth<Data = IAnything>  {
  minWidth?: PickProp<IField<Data>, 'minWidth'>;
  phoneMinWidth?: PickProp<IField<Data>, 'phoneMinWidth'>;
  tabletMinWidth?: PickProp<IField<Data>, 'tabletMinWidth'>;
  desktopMinWidth?: PickProp<IField<Data>, 'desktopMinWidth'>;
}

interface IHeroMaxWidth<Data = IAnything>  {
  maxWidth?: PickProp<IField<Data>, 'maxWidth'>;
  phoneMaxWidth?: PickProp<IField<Data>, 'phoneMaxWidth'>;
  tabletMaxWidth?: PickProp<IField<Data>, 'tabletMaxWidth'>;
  desktopMaxWidth?: PickProp<IField<Data>, 'desktopMaxWidth'>;
}

interface IHeroStyle<Data = IAnything>  {
  heroOuterStyle?: PickProp<IField<Data>, 'heroOuterStyle'>;
  heroOuterPhoneStyle?: PickProp<IField<Data>, 'heroOuterPhoneStyle'>;
  heroOuterTabletStyle?: PickProp<IField<Data>, 'heroOuterTabletStyle'>;
  heroOuterDesktopStyle?: PickProp<IField<Data>, 'heroOuterDesktopStyle'>;
  heroInnerStyle?: PickProp<IField<Data>, 'heroInnerStyle'>;
  heroInnerPhoneStyle?: PickProp<IField<Data>, 'heroInnerPhoneStyle'>;
  heroInnerTabletStyle?: PickProp<IField<Data>, 'heroInnerTabletStyle'>;
  heroInnerDesktopStyle?: PickProp<IField<Data>, 'heroInnerDesktopStyle'>;
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

const useStyles = makeStyles({
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

export interface IHeroLayoutProps<Data = IAnything> extends IHeroRegistry<Data>, Group<Data>{
  className?: PickProp<IField<Data>, 'className'>;
  style?: PickProp<IField<Data>, 'style'>;
  object: PickProp<IEntity<Data>, 'object'>;
}

interface IHeroLayoutPrivate {
  children: React.ReactChild;
  theme?: Theme;
}

interface IBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface IContainerProps<Data extends IAnything> {
  children: React.ReactChild;
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
  md = 960,
  lg = 1280,
}: IBreakpoints) => ({
  isPhone: match(xs, md),
  isTablet: match(md, lg),
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
  theme,
  className,
  style,
  object,
  columns,
  columnsOverride,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  ...otherProps
}: IHeroLayoutProps<Data> & IHeroLayoutPrivate) => {
  const { breakpoints: { values: bpoints } } = theme!;
  const groupRef: React.MutableRefObject<any> = useRef(null);
  const classes = useStyles();
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
      >
        <AutoSizer
          className={classes.content}
          delay={AUTOSIZER_DELAY}
          target={document.body}
          disableHeight
          disableWidth
          keepFlow
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

export default withTheme(HeroLayout) as typeof HeroLayout;
