import { Cats } from "src/util/theme";
import React from "react";

type Props = {
  color?: string,
  className?: string
}

export const Cat = ({color, className}: Props) =>
  <img
    className={className}
    src={ Cats.getCatFromColor(color || Cats.getNextCatColor()) }
    alt="cat"
  />
