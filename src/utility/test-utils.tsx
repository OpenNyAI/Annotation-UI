/* eslint-disable import/no-extraneous-dependencies */
import { type ReactElement } from 'react';
import { render, renderHook, type RenderOptions } from '@testing-library/react';
import mediaQuery from 'css-mediaquery';
import { queryClient, TestProvider, type TestProviderProps } from '../providers/TestProviders';

interface TestWrapperProps extends Omit<RenderOptions, 'wrapper'> {
    wrapperProps?: TestProviderProps['defaultProviderValues'];
}

afterEach(() => {
    queryClient.clear();
});

const createMatchMedia =
    (width: number) =>
    (query: string): MediaQueryList => ({
        matches: mediaQuery.match(query, { width }),
        media: query,
        onchange: null,
        addListener: () => jest.fn(),
        removeListener: () => jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    });

const resizeScreenSize = (width: number) => {
    window.matchMedia = createMatchMedia(width);
};

const customRender = (ui: ReactElement, options?: TestWrapperProps) =>
    render(ui, {
        wrapper: (props) => (
            <TestProvider {...props} defaultProviderValues={options?.wrapperProps} />
        ),
        ...options,
    });

const renderHookWithProvider = (
    ui: (initialProps: unknown) => unknown,
    options?: TestWrapperProps,
) =>
    renderHook(ui, {
        wrapper: ({ children, ...props }) => (
            <TestProvider {...props} defaultProviderValues={options?.wrapperProps}>
                {children}
            </TestProvider>
        ),
    });

export * from '@testing-library/react';
export { customRender as render, resizeScreenSize, renderHookWithProvider };
