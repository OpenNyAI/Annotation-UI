import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const themeBase = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#000000",
      default: "#000000",
    },
    primary: {
      main: "#2C2F33",
    },
    text: {
      primary: "#FAFAFA",
    },
    borderGrey: "#C4C4C4",
  },

  typography: {
    fontFamily: "Gilroy",
    fontSize: 16,
    h2: {
      fontSize: "2.5rem",
      fontWeight: "bold",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1330,
    },
  },
});

export const theme = responsiveFontSizes(
  createTheme({
    ...themeBase,
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            body1: "span",
            body2: "span",
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          asterisk: {
            color: "#E5948E",
            "&$error": {
              color: "#FFB4AB",
            },
          },
          root: {
            color: themeBase.palette.text.primary,
            "&.Mui-focused": {
              color: themeBase.palette.text.primary,
            },
            fontSize: 20,
            fontWeight: 400,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          outlined: {
            fontSize: 20,
            fontWeight: 400,
          },
          root: {
            color: themeBase.palette.text.primary,
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginLeft: 0,
            position: "absolute",
            bottom: "-1.5rem",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            height: "40px",
            fontSize: "20px",
            fontWeight: "700",
          },
          contained: {
            backgroundColor: themeBase.palette.primary.main,
            color: themeBase.palette.text.primary,
            "&:hover": {
              backgroundColor: themeBase.palette.primary.main,
            },
            borderRadius: "4px",
            padding: "8px 16px",
          },
          text: {
            height: "auto",
            paddingTop: 0,
            paddingBottom: 0,
            color: themeBase.palette.text.primary,
          },
        },
      },
    },
  })
);
