package com.gberard.tournament.repository;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import com.google.api.client.testing.http.MockHttpTransport;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.repository.GameRepository.RANGE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class GameRepositoryTest extends SheetRepositoryTest {

    private static final List<Object> RAW_GAME_1 =
            rawData("game1", "29/08/2022", "10:30", "court", "teamA", "teamB", "teamC", "25", "14");
    private static final List<Object> RAW_GAME_2 =
            rawData("game2", "29/08/2022", "11:30", "court", "teamC", "teamB");
    private static final List<Object> RAW_GAME_3 =
            rawData("game3", "29/08/2022", "13:30", "court", "teamA", "teamC", "", "", "");
    private static final List<Object> RAW_GAME_4 =
            rawData("game4", "29/08/2022", "14:30", "court", "teamA", "teamB", "");

    @Spy
    @InjectMocks
    private GameRepository gameRepository;

    @Mock
    private TeamRepository teamService;

    private void mockTeamService(Team... teams) {
        if (teams.length == 0) {
            when(teamService.search(any())).thenReturn(Optional.of(teamA));
        } else {
            Arrays.stream(teams)
                    .forEach(team -> when(teamService.search(eq(team.id()))).thenReturn(Optional.of(team)));
        }
    }

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        void shoud_call_spreadsheet_url() throws Exception{
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            gameRepository.create(game1);

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl())
                    .isEqualTo(TARGET_URL + "/" + RANGE +  ":append?valueInputOption=USER_ENTERED");
        }

        @Test
        void shoud_use_toRawData_mapper() throws Exception{
            // Given
            mockServerResponse();

            // When
            gameRepository.create(game1);

            // Then
            verify(gameRepository,times(1)).toRawData(eq(game1));
        }

        @Test
        void shoud_send_serialized_completed_game() throws Exception{
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            gameRepository.create(game1);

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getContentAsString())
                    .contains("{\"values\":[[\"game1\",\"29/08/2022\",\"10:30\",\"court\",\"teamA\",\"teamB\"," +
                            "\"teamC\",\"25\",\"14\"]]}");
        }

        @Test
        void shoud_send_serialized_partial_game() throws Exception{
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            gameRepository.create(game2);

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getContentAsString())
                    .contains("{\"values\":[[\"game2\",\"29/08/2022\",\"11:30\",\"court\",\"teamC\",\"teamB\"," +
                            "\"\",\"\",\"\"]]}");
        }

    }

    @Nested
    @DisplayName("readAll()")
    class ReadAll {

        @Test
        void shoud_call_spreadsheet_url() throws Exception {
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            gameRepository.readAll();

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl()).isEqualTo(TARGET_URL + "/" + RANGE);
        }

        @Test
        void shoud_use_fromRawData_mapper() throws Exception{
            // Given
            mockServerResponse(getGetResponse(List.of(RAW_GAME_1, RAW_GAME_2)));
            mockTeamService(teamA, teamB, teamC);

            // When
            gameRepository.readAll();

            // Then
            verify(gameRepository,times(1)).fromRawData(eq(RAW_GAME_1));
            verify(gameRepository,times(1)).fromRawData(eq(RAW_GAME_2));
        }

        @Test
        void shoud_return_deserialized_game() throws Exception{
            // Given
            mockServerResponse(getGetResponse(List.of(RAW_GAME_1, RAW_GAME_2)));
            mockTeamService(teamA, teamB, teamC);

            // When
            List<Game> teams = gameRepository.readAll();

            // Then
            assertThat(teams).hasSize(2);
            assertThat(teams.get(0)).isEqualTo(game1);
            assertThat(teams.get(1)).isEqualTo(game2);
        }

    }

    @Nested
    @DisplayName("searchFor()")
    class SearchFor {

        @Test
        void should_filter_properly() throws Exception{
            // Given
            mockServerResponse(getGetResponse(List.of(RAW_GAME_1, RAW_GAME_3, RAW_GAME_4)));
            mockTeamService(teamA, teamB, teamC);

            // When
            List<Game> gamesFor = gameRepository.searchFor(teamB);

            // Then
            assertThat(gamesFor).map(Game::id).containsExactly("game1", "game4");
        }

    }

    @Nested
    @DisplayName("DeleteAll()")
    class DeleteAll {

        @Test
        void shoud_call_spreadsheet_url() throws Exception {
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            gameRepository.deleteAll();

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl())
                    .isEqualTo(TARGET_URL + ":batchClearByDataFilter");
        }

    }

}