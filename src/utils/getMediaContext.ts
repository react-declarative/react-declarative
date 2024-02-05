interface IBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const GRID_MAX_WIDTH = 9999999999999999;

const match = (from: number, to: number) =>
  window.innerWidth >= from && window.innerWidth < to;

export const getMediaContext = ({
  xs = 0,
  sm = 600,
  // md = 960,
  lg = 1280,
}: // xl = 1536,
Partial<IBreakpoints> = {}) => ({
  isPhone: match(xs, sm),
  isTablet: match(sm, lg),
  isDesktop: match(lg, GRID_MAX_WIDTH),
});

export default getMediaContext;
