import { Team } from "../data/Team";
import { getCookie, setCookie } from "./CookieService";
import { getCurrentTeam, setCurrentTeam, TEAM_CNAME } from "./TeamService";

jest.mock("./CookieService", () => ({
    getCookie: jest.fn(),
    setCookie: jest.fn(),
}));

const TEAMS = [
    { id: "id1", name: "name1" },
    { id: "id2", name: "name2" },
    { id: "id3", name: "name3" },
];

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve<Team[]>(TEAMS),
    }),
) as jest.Mock;

describe("setCurrentTeam", () => {
    it("should set the cookie with team id ", () => {
        // When
        setCurrentTeam(TEAMS[0]);

        // Then
        expect(setCookie).toHaveBeenCalledWith(TEAM_CNAME, JSON.stringify(TEAMS[0]), 10);
    });
});

describe("getCurrentTeam", () => {
    it("should read cookie dans match the existing teams ", () => {
        // Given
        const getCookieMocked = getCookie as jest.MockedFunction<typeof getCookie>;
        getCookieMocked.mockImplementation(() => JSON.stringify(TEAMS[2]));

        // When
        const currentTeam = getCurrentTeam();

        // Then
        expect(currentTeam).toStrictEqual(TEAMS[2]);
    });

    it("should return undefined if cookie does'nt exists", () => {
        // Given
        const getCookieMocked = getCookie as jest.MockedFunction<typeof getCookie>;
        getCookieMocked.mockImplementation(() => undefined);

        // When
        const currentTeam = getCurrentTeam();

        // Then
        expect(currentTeam).toStrictEqual(undefined);
    });
});
