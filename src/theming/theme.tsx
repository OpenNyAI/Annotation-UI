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
  },
  color: {
    inputLabel: "#FAFAFA",
    grey: "#2C2F33",
    black: "#000000",
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
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
            color: themeBase.color.inputLabel,
            "&.Mui-focused": {
              color: themeBase.color.inputLabel,
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
            color: themeBase.color.inputLabel,
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
            backgroundColor: themeBase.color.grey,
            color: themeBase.color.inputLabel,
            ":hover": {
              backgroundColor: themeBase.color.grey,
            },
            borderRadius: "4px",
            padding: "8px 16px",
          },
          text: {
            height: "auto",
            paddingTop: 0,
            paddingBottom: 0,
            color: themeBase.color.inputLabel,
          },
        },
      },
    },
  })
);
