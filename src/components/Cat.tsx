import { Cats } from "src/util/theme";
import React, { useEffect, useState } from "react";

type Props = {
  color?: string,
  className?: string
}

export const Cat = ({color, className}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsVisible(true), Math.floor(Math.random() * 2000))
  }, [])
  return isVisible ? <img
    className={ className }
    src={ Cats.getCatFromColor(color || Cats.getNextCatColor()) }
    alt="cat"
  /> : <></>
}
