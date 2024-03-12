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

/**
 * Calculates the media context based on provided breakpoints.
 * @param breakpoints - The breakpoints to use for the media context calculation.
 * @param [breakpoints.xs=0] - The extra small breakpoint.
 * @param [breakpoints.sm=600] - The small breakpoint.
 * @param [breakpoints.lg=1280] - The large breakpoint.
 * @returns - The media context object.
 * @property isPhone - Indicates if the media context is for a phone.
 * @property isTablet - Indicates if the media context is for a tablet.
 * @property isDesktop - Indicates if the media context is for a desktop.
 * @property isWide - Indicates if the media context is for a wide screen.
 * @property isMobile - Indicates if the media context is for a mobile device.
 */
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
