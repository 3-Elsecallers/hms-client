"use client";

import { Nunito } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: nunito.style.fontFamily,
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#4A8C85",
      light: "#6AADA6",
      dark: "#367870",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#607D8B",
      light: "#90A4AE",
      dark: "#455A64",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F0F4F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D3748",
      secondary: "#718096",
      disabled: "#A0AEC0",
    },
    success: {
      main: "#6BAE95",
      light: "#8EC4AD",
      dark: "#4A9076",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#D4A84B",
      light: "#E0C077",
      dark: "#B08A2E",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#C97070",
      light: "#D99090",
      dark: "#A85050",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#5B8FA8",
      light: "#7AAFC4",
      dark: "#3D7090",
      contrastText: "#FFFFFF",
    },
    divider: "#E2E8F0",
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontWeight: 600,
          fontSize: "0.9rem",
        },
        contained: {
          boxShadow: "0 2px 8px rgba(74, 140, 133, 0.28)",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(74, 140, 133, 0.38)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#FAFBFC",
            "&.Mui-focused": {
              backgroundColor: "#FFFFFF",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4A8C85",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          border: "1px solid #EDF2F7",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: "0.78rem",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginInline: "8px",
          "&.Mui-selected": {
            backgroundColor: "rgba(74, 140, 133, 0.12)",
            color: "#4A8C85",
            "& .MuiListItemIcon-root": {
              color: "#4A8C85",
            },
            "&:hover": {
              backgroundColor: "rgba(74, 140, 133, 0.18)",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E2E8F0",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
