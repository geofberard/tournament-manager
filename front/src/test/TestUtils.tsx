import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, RenderOptions } from "@testing-library/react";
import * as React from "react";
import { FC, ReactElement } from "react";
import { createRenderer } from "react-test-renderer/shallow";

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
    return <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };

export const testSnapshot = (component: JSX.Element) => {
    it("should match last snapshot", () => {
        // Given
        const renderer = createRenderer();

        // When
        const result = renderer.render(component);

        // Then
        expect(result).toMatchSnapshot();
    });
};

export const mockFunctionReturn: <T>(functionToMock: () => T, resultToReturn: T) => void = (
    functionToMock,
    resultToReturn,
) => {
    const useTeamsMocked = functionToMock as jest.MockedFunction<typeof functionToMock>;
    useTeamsMocked.mockImplementation(() => resultToReturn);
};
