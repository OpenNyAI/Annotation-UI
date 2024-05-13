import type React from "react";

import "@emotion/react";

interface AdditionalButtonColors {
  teritiary: ButtonColors["color"];
}

interface AdditionalPalette {
  borderGrey: PaletteOptions["color"];
}
interface MF_Theme {
  palette: Palette;
}

declare module "@mui/material/styles" {
  interface Theme extends MF_Theme {}

  interface ThemeOptions extends MF_Theme {}
}

declare module "@emotion/react" {
  export interface Theme extends MF_Theme {}
}

declare module "@mui/material/styles" {
  interface Theme extends MF_Theme {}

  interface ThemeOptions extends MF_Theme {}

  interface Palette extends AdditionalPalette {}

  interface PaletteOptions extends AdditionalPalette {}

  interface TypographyVariants extends AdditionalTypographyVariants {}

  interface TypographyVariantsOptions extends AdditionalTypographyVariants {}

  interface ButtonColors extends AdditionalButtonColors {}

  interface ButtonColorsOptions extends AdditionalButtonColors {}
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
    body4: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    teritiary: true;
  }
}
