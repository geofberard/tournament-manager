import * as React from "react";
import { FC } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({});

export const RootApp: FC = () => {
  const test = "this is a test";
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>Hello World !</div>
    </ThemeProvider>
  );
};
