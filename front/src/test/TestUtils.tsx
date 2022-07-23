import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, RenderOptions } from '@testing-library/react';
import * as React from 'react';
import { FC, ReactElement } from 'react';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider theme={createTheme()}>
            {children}
        </ThemeProvider>
    )
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react';
export { customRender as render };
