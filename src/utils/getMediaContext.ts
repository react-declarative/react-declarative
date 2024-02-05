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
Partial<IBreakpoints> = {}) => {
  const isPhone = match(xs, sm);
  const isTablet = match(sm, lg);
  const isDesktop = match(lg, GRID_MAX_WIDTH);
  return {
    isPhone,
    isTablet,
    isDesktop,
    isWide: isTablet || isDesktop,
    isMobile: isPhone,
  };
};

export default getMediaContext;
