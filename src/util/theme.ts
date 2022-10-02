import Cat1 from "../assets/cats/cats1.gif"
import Cat2 from "../assets/cats/cats2.gif"
import Cat3 from "../assets/cats/cats3.gif"
import Cat4 from "../assets/cats/cats3.gif"

export const Theme = {
  ACTION_MAIN: "#FFA500",
  ACTION_GRAY: "#a5a5a5",
  BACKGROUND: "#eaeaea"
}

const ColorToCat: Record<string, string> = {
  "#403c37": Cat1,
  "#decfba": Cat2,
  "#ab895b": Cat3,
  "#2e2e2e": Cat4,
}

export const Cats = {
  getNextCatColor: () => {
    const colors = Object.keys(ColorToCat);
    return colors[Math.floor(Math.random() * colors.length)];
  },
  getCatFromColor: (color: string) => ColorToCat[color]
}
