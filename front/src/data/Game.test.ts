import Game, { Result } from "./Game"

type GameKeys = keyof Partial<Game>;

const teamA = { id: "teamA", name: "TeamA" };
const teamB = { id: "teamB", name: "TeamB" };

const partialGame: Partial<Game> = {
    id: "gameId",
    time: new Date(),
    court: "court",
    teamA: teamA,
    teamB: teamB,
    referee: { id: "teamC", name: "TeamC" },
}

const fullGame: Partial<Game> = {
    id: "gameId",
    time: new Date(),
    court: "court",
    teamA: teamA,
    teamB: teamB,
    referee: { id: "teamC", name: "TeamC" },
    scoreA: 25,
    scoreB: 14,
}

describe('constructor', () => {
    it('should create from game json object without score', () => {
        // When
        const game = new Game(partialGame);

        // Then
        Object.keys(partialGame)
            .forEach((key: GameKeys) => expect(partialGame[key]).toBe(game[key]));
    })

    it('should create from game json object without score', () => {
        // When
        const game = new Game(fullGame);

        // Then
        Object.keys(partialGame)
            .forEach((key: GameKeys) => expect(fullGame[key]).toBe(game[key]));
    })
})

describe('isFinished', () => {
    it.each([
        [true, "both scores defined", fullGame],
        [false, "no scores defined", partialGame],
        [false, "only scoreA defined", { ...partialGame, scoreA: 24 }],
        [false, "only scoreB defined", { ...partialGame, scoreB: 26 }],
    ])('should be %p if game have %p', (expected, scenario, gameJson) => {
        // When
        const game = new Game(gameJson);

        // Then
        expect(game.isFinished()).toBe(expected);
    })
})

describe('getResultGameByTeam', () => {

    it('should manage TeamA > TeamB', () => {
        // When
        const game = new Game({ ...partialGame, scoreA: 24, scoreB: 18 });

        // Then
        expect(game.getResultGameByTeam(teamA)).toBe(Result.WON);
        expect(game.getResultGameByTeam(teamB)).toBe(Result.LOST);
    })

    it('should manage TeamB > TeamA', () => {
        // When
        const game = new Game({ ...partialGame, scoreA: 24, scoreB: 26 });

        // Then
        expect(game.getResultGameByTeam(teamA)).toBe(Result.LOST);
        expect(game.getResultGameByTeam(teamB)).toBe(Result.WON);
    })

    it.each([
        [Result.NOT_PLAYED, "no score defined", partialGame],
        [Result.NOT_PLAYED, "only scoreA defined", { ...partialGame, scoreA: 24 }],
        [Result.NOT_PLAYED, "only scoreB defined", { ...partialGame, scoreB: 22 }],
        [Result.DEUCE, "only scores are equals", { ...partialGame, scoreA: 22, scoreB: 22 }],
    ])('should be %p if game have %p', (expected, scenario, gameJson) => {
        // When
        const game = new Game(gameJson);

        // Then
        expect(game.getResultGameByTeam(teamA)).toBe(expected);
        expect(game.getResultGameByTeam(teamB)).toBe(expected);
    })

})