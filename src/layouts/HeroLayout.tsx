import * as React from 'react';
import { useMemo } from 'react';

import classNames from '../utils/classNames';

import withTheme from '@material-ui/core/styles/withTheme';

import { makeStyles } from '@material-ui/core';

import { Theme } from '@material-ui/core/styles/createMuiTheme';

import IField from '../model/IField';
import IAnything from '../model/IAnything';

import { DeepPartial, PickProp } from '../model/IManaged';

import AutoSizer from '../components/AutoSizer';

import Group, { IGroupProps } from '../components/Group';

const DEFAULT_MARGIN = '0px';
const DEFAULT_SIZE = '100%';

const GRID_MAX_WIDTH = 9999999999999999;
const FIELD_NEVER_MARGIN = '0';
const AUTOSIZER_DELAY = 500;

interface IHeroTop<Data = IAnything>  {
  top: PickProp<IField<Data>, 'top'>;
  phoneTop: PickProp<IField<Data>, 'phoneTop'>;
  tabletTop: PickProp<IField<Data>, 'tabletTop'>;
  desktopTop: PickProp<IField<Data>, 'desktopTop'>;
}

interface IHeroLeft<Data = IAnything>  {
  left: PickProp<IField<Data>, 'left'>;
  phoneLeft: PickProp<IField<Data>, 'phoneLeft'>;
  tabletLeft: PickProp<IField<Data>, 'tabletLeft'>;
  desktopLeft: PickProp<IField<Data>, 'desktopLeft'>;
}

interface IHeroRight<Data = IAnything>  {
  right: PickProp<IField<Data>, 'right'>;
  phoneRight: PickProp<IField<Data>, 'phoneRight'>;
  tabletRight: PickProp<IField<Data>, 'tabletRight'>;
  desktopRight: PickProp<IField<Data>, 'desktopRight'>;
}

interface IHeroBottom<Data = IAnything>  {
  bottom: PickProp<IField<Data>, 'bottom'>;
  phoneBottom: PickProp<IField<Data>, 'phoneBottom'>;
  tabletBottom: PickProp<IField<Data>, 'tabletBottom'>;
  desktopBottom: PickProp<IField<Data>, 'desktopBottom'>;
}

interface IHeroHeight<Data = IAnything>  {
  height: PickProp<IField<Data>, 'height'>;
  phoneHeight: PickProp<IField<Data>, 'phoneHeight'>;
  tabletHeight: PickProp<IField<Data>, 'tabletHeight'>;
  desktopHeight: PickProp<IField<Data>, 'desktopHeight'>;
}

interface IHeroWidth<Data = IAnything>  {
  width: PickProp<IField<Data>, 'width'>;
  phoneWidth: PickProp<IField<Data>, 'phoneWidth'>;
  tabletWidth: PickProp<IField<Data>, 'tabletWidth'>;
  desktopWidth: PickProp<IField<Data>, 'desktopWidth'>;
}

type IHeroRegistry<D = IAnything> = 
  DeepPartial<
    IHeroTop<D>
      & IHeroLeft<D>
      & IHeroRight<D>
      & IHeroBottom<D>
      & IHeroWidth<D>
      & IHeroHeight<D>
  >;

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
  width: number;
  registry: IHeroRegistry<Data>;
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
  width,
  registry,
  children,
}: IContainerProps<Data>) => {

  const {
    isDesktop,
    isTablet,
    isPhone,
  } = getScreenInfo(bpoints);

  const [outerStyles, innerStyles] = useMemo(() => {

    const outerStyles: React.CSSProperties = {};
    const innerStyles: React.CSSProperties = {};

    if (isDesktop) {
      outerStyles.height = registry.desktopHeight || registry.height || DEFAULT_SIZE;
      outerStyles.width = registry.desktopWidth || registry.width || DEFAULT_SIZE;
      innerStyles.top =  registry.desktopTop || registry.top || DEFAULT_MARGIN;
      innerStyles.left = registry.desktopLeft || registry.left || DEFAULT_MARGIN;
      innerStyles.right = registry.desktopRight || registry.right || DEFAULT_MARGIN;
      innerStyles.bottom = registry.desktopBottom || registry.bottom || DEFAULT_MARGIN;
    } else if (isTablet) {
      outerStyles.height = registry.tabletHeight || registry.height || DEFAULT_SIZE;
      outerStyles.width = registry.tabletWidth || registry.width || DEFAULT_SIZE;
      innerStyles.top =  registry.tabletTop || registry.top || DEFAULT_MARGIN;
      innerStyles.left = registry.tabletLeft || registry.left || DEFAULT_MARGIN;
      innerStyles.right = registry.tabletRight || registry.right || DEFAULT_MARGIN;
      innerStyles.bottom = registry.tabletBottom || registry.bottom || DEFAULT_MARGIN;
    } else if (isPhone) {
      outerStyles.height = registry.phoneHeight || registry.height || DEFAULT_SIZE;
      outerStyles.width = registry.phoneWidth || registry.width || DEFAULT_SIZE;
      innerStyles.top =  registry.phoneTop || registry.top || DEFAULT_MARGIN;
      innerStyles.left = registry.phoneLeft || registry.left || DEFAULT_MARGIN;
      innerStyles.right = registry.phoneRight || registry.right || DEFAULT_MARGIN;
      innerStyles.bottom = registry.phoneBottom || registry.bottom || DEFAULT_MARGIN;
    } else {
      throw new Error('HeroLayout invalid media query');
    }

    return [outerStyles, innerStyles];

  }, [
    width,
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
  columns,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  ...otherProps
}: IHeroLayoutProps<Data> & IHeroLayoutPrivate) => {
  const { breakpoints: { values: bpoints } } = theme!;
  const classes = useStyles();
  return (
    <Group
      className={classNames(className, classes.root)}
      style={style}
      isItem={true}
      columns={columns}
      phoneColumns={phoneColumns}
      tabletColumns={tabletColumns}
      desktopColumns={desktopColumns}
      fieldRightMargin={FIELD_NEVER_MARGIN}
      fieldBottomMargin={FIELD_NEVER_MARGIN}
    >
      <Group className={classes.container}>
        <AutoSizer
          className={classes.content}
          delay={AUTOSIZER_DELAY}
          target={document.body}
          disableHeight
          disableWidth
        >
          {({ width }) => width ? (
            <Container<Data>
              className={classes.item}
              bpoints={bpoints}
              width={width}
              registry={otherProps}
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
