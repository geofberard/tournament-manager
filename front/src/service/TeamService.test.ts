import { Team } from "../data/Team";
import { getTeams, getTeam, TEAM_CNAME, setCurrentTeam, getCurrentTeam } from "./TeamService";
import { getCookie, setCookie } from "./CookieService";

jest.mock("./CookieService", () => (
    {
        getCookie: jest.fn(),
        setCookie: jest.fn(),
    }
));

const TEAMS = [
    { id: "id1", name: "name1" },
    { id: "id2", name: "name2" },
    { id: "id3", name: "name3" },
];

global.fetch = jest.fn((url: string) =>
    Promise.resolve({
        json: () => Promise.resolve<Team[]>(TEAMS),
    })
) as jest.Mock;

describe('fetchTeams', () => {
    it('should get the right number of teams ', async () => {
        // When
        const teams = await getTeams();

        // Then
        expect(teams).toHaveLength(TEAMS.length)
    })

    it('should get the right teams in the list ', async () => {
        // When
        const teams = await getTeams();

        // Then
        expect(teams[0]).toBe(TEAMS[0]);
        expect(teams[1]).toBe(TEAMS[1]);
        expect(teams[2]).toBe(TEAMS[2]);
    })
})

describe('parseTeamId', () => {
    it('should return the right team if it exists ', async () => {
        // When
        const team = await getTeam(TEAMS[1].id);

        // Then
        expect(team).toBe(TEAMS[1]);
    })

    it('should return undefined if id don\'t exists ', async () => {
        // When
        const team = await getTeam("wrong");

        // Then
        expect(team).toBeUndefined();
    })

})

describe('setCurrentTeam', () => {
    it('should set the cookie with team id ', () => {
        // When
        setCurrentTeam(TEAMS[0]);
        
        // Then
        expect(setCookie).toHaveBeenCalledWith(TEAM_CNAME,TEAMS[0].id,10);
    })
})

describe('getCurrentTeam', () => {
    it('should read cookie dans match the existing teams ', async () => {
        // Given
        const getCookieMocked = getCookie as jest.MockedFunction<typeof getCookie>
        getCookieMocked.mockImplementation((id:string) => TEAMS[2].id);

        // When
        const currentTeam = await getCurrentTeam();

        // Then
        expect(currentTeam).toBe(TEAMS[2])
        
    })

})
