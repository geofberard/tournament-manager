import { act, renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import * as React from 'react'
import { FC } from 'react'
import { Team } from '../../data/Team';
import { API_TEAMS } from '../../service/TeamService';
import { useTeams } from './useTeams';
import useSWR from 'swr';
import { fetchJson } from '../../service/PromiseService';

const MOCKED_TEAMS: Team[] = [
    {id: "team1", name: "Team1"},
    {id: "team2", name: "Team2"}
];

jest.mock('swr', () => ({
    default: jest.fn(),
}));

const mockedGetCookie = useSWR as jest.MockedFunction<typeof useSWR>;

mockedGetCookie.mockImplementation(() => ({
    data: MOCKED_TEAMS,
    mutate: undefined,
    isValidating: undefined
}));

describe('initialization', () => {
    it('should init using API url', async () => {
        // Given
        let hook: RenderHookResult<Team[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useTeams());
        })

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(
                API_TEAMS,
                expect.anything(),
                expect.anything()
            );
        })
    })

    it('should init using fetchJson', async () => {
        // Given
        let hook: RenderHookResult<Team[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useTeams());
        })

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(
                expect.anything(),
                fetchJson,
                expect.anything()
            );
        })
    })

    it('should init using suspense', async () => {
        // Given
        let hook: RenderHookResult<Team[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useTeams());
        })

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                { suspense: true }
            );
        })
    })
})
