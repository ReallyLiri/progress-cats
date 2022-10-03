// @ts-ignore
import useMobileDetect from "use-mobile-detect-hook";
import { useMemo } from "react";

export const useIsMobile = () => {
  const {isMobile: getIsMobile} = useMobileDetect();
  const isMobile = useMemo(() => getIsMobile(), [getIsMobile]);
  return {isMobile}
}
