import { Team } from "./Team";
import { sortByName } from "./TeamUtils";

describe("sortByName", () => {
    it("should sort in name in alphabetical order ", async () => {
        // Given
        const teamA: Team = { id: "", name: "TeamA",label: "TeamA label", players: []};
        const teamB: Team = { id: "", name: "TeamB",label: "TeamB label", players: []};
        const teamC: Team = { id: "", name: "TeamC",label: "TeamC label", players: []};
        const teams: Team[] = [teamC, teamB, teamA];

        // When
        const sortedTeams = teams.sort(sortByName);

        // Then
        expect(sortedTeams[0]).toBe(teamA);
        expect(sortedTeams[1]).toBe(teamB);
        expect(sortedTeams[2]).toBe(teamC);
    });
});
