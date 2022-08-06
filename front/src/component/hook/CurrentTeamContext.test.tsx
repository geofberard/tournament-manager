import { act, renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import * as React from 'react'
import { FC } from 'react'
import { Team } from '../../data/Team';
import { getCurrentTeam, setCurrentTeam } from '../../service/TeamService';
import { CurrentTeamProvider, useCurrentTeam } from './CurrentTeamContext'

jest.mock('../../service/TeamService', () => (
    {
        getCurrentTeam: jest.fn(),
        setCurrentTeam: jest.fn(),
    }
));

const wrapper: FC<React.PropsWithChildren> = ({ children }) => <CurrentTeamProvider>{children}</CurrentTeamProvider>

const MOCKED_TEAM: Team = { id: "currentTeam", name: "currentTeam" };

function mockGetCookie(team: Team = undefined) {
    const getCookieMocked = getCurrentTeam as jest.MockedFunction<typeof getCurrentTeam>;
    getCookieMocked.mockImplementation(() => team);
}

describe('initialization', () => {
    it('should init using TeamService ', async () => {
        // Given
        mockGetCookie();
        let hook: RenderHookResult<[Team, (team: Team) => void], {}>;

        // When
        await act(() => {
            hook = renderHook(() => useCurrentTeam(), { wrapper });
        })

        // Then
        await waitFor(() => {
            expect(getCurrentTeam).toHaveBeenCalled();
        })
    })

    it('should not set initial value if TeamService returns undefined ', async () => {
        // Given
        mockGetCookie();
        let hook: RenderHookResult<[Team, (team: Team) => void], {}>;

        // When
        await act(() => {
            hook = renderHook(() => useCurrentTeam(), { wrapper });
        })

        // Then
        await waitFor(() => {
            const [currentTeam] = hook.result.current;
            expect(currentTeam).toBeUndefined();
        })
    })

    it('should set initial value if TeamService returns team ', async () => {
        // Given
        mockGetCookie(MOCKED_TEAM);
        let hook: RenderHookResult<[Team, (team: Team) => void], {}>;

        // When
        act(() => {
            hook = renderHook(() => useCurrentTeam(), { wrapper });
        })

        // Then
        await waitFor(() => {
            const [currentTeam] = hook.result.current;
            expect(currentTeam).toBe(MOCKED_TEAM)
        })
    })
})

describe('setting values', () => {
    it('should set initial value if TeamService returns team ', async () => {
        // Given
        mockGetCookie();
        let hook: RenderHookResult<[Team, (team: Team) => void], {}>;

        // When
        await act(() => {
            hook = renderHook(() => useCurrentTeam(), { wrapper });
        })

        await act(() => {
            const [, setCurrentTeam] = hook.result.current;
            setCurrentTeam(MOCKED_TEAM)
        })

        // Then
        const [currentTeam] = hook.result.current;
        expect(currentTeam).toBe(MOCKED_TEAM)
    })

    it('should call TeamService on value changed', async () => {
        // Given
        mockGetCookie();
        let hook: RenderHookResult<[Team, (team: Team) => void], {}>;

        // When
        await act(() => {
            hook = renderHook(() => useCurrentTeam(), { wrapper });
        })

        await act(() => {
            const [, setCurrentTeam] = hook.result.current;
            setCurrentTeam(MOCKED_TEAM)
        })

        // Then
        await waitFor(() => {
            expect(setCurrentTeam).toHaveBeenCalledWith(MOCKED_TEAM);
        })
    })

})
