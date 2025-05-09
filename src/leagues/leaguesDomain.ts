import { id } from "@instantdb/core";
import type { AppEvent, League, Match, Player } from "../domain";
import {
  linkEntity,
  transact,
  updateEntity,
  updateStore,
} from "../domainHelpers.ts";
import { containsName, type PlayersState } from "../players/playersDomain.ts";
import { uniqBy } from "lodash";

export type LeagueFormState = {
  name?: { value?: string; error?: string };
};

export type LeaguesState = {
  newLeague?: LeagueFormState;
};

export type LeagueFormProps = {
  name: { value?: string; error?: string; onChange: (value: string) => void };
  onSubmit: () => void;
  onCancel?: () => void;
};

export const prepLeagueForm = (props: {
  store: PlayersState & LeaguesState;
  dispatch: (events: AppEvent[]) => void;
  leagues?: League[];
  players?: Player[];
}): LeagueFormProps => {
  const form = props.store.newLeague;

  return {
    name: {
      value: form?.name?.value ?? "",
      error: form?.name?.error,
      onChange: (value) => {
        props.dispatch([
          updateStore({
            newLeague: {
              ...form,
              name: {
                value,
                error: form?.name?.error
                  ? validateName(props.leagues, value)
                  : undefined,
              },
            },
          }),
        ]);
      },
    },
    onSubmit: () => {
      const error = validateName(props.leagues, form?.name?.value);
      if (error) {
        props.dispatch([
          updateStore({
            newLeague: {
              ...form,
              name: {
                ...form?.name,
                error,
              },
            },
          }),
        ]);
      } else {
        const leagueId = id();
        const matches = createMatches(props.players ?? []);
        props.dispatch([
          transact([
            updateEntity("leagues", leagueId, { name: form?.name?.value }),
            linkEntity("leagues", leagueId, {
              players: props.players?.map((p) => p.id),
            }),
            ...matches.flatMap((m) => [
              updateEntity("matches", m.id, {}),
              linkEntity("matches", m.id, { player1: m.player1Id }),
              linkEntity("matches", m.id, { player2: m.player2Id }),
              linkEntity("leagues", leagueId, { matches: [m.id] }),
            ]),
          ]),
          updateStore({ newLeague: undefined }),
        ]);
      }
    },
  };
};

function validateName(
  leagues: League[] | undefined,
  value: string | undefined,
): string | undefined {
  switch (true) {
    case !value?.trim():
      return "Required";
    case containsName(leagues ?? [], value ?? ""):
      return "Already exists";
  }
}

export type LeaguesListProps = {
  leagues: {
    name: string;
    results: {
      playerName: string;
      wins: number;
      losses: number;
      points: number;
    }[];
    matches: Array<
      Match & {
        onOpen: () => void;
        player1: string;
        player2: string;
      }
    >;
  }[];
};

export const prepLeaguesListForm = (props: {
  store: LeaguesState;
  dispatch: (events: AppEvent[]) => void;
  leagues?: Array<
    League & {
      players: Player[];
      matches: Array<
        Match & { player1?: Player; player2?: Player; onOpen: () => void }
      >;
    }
  >;
}): LeaguesListProps => {
  return {
    leagues: (props.leagues ?? []).map((l) => ({
      name: l.name,
      results: l.players.map((p) => ({
        playerName: p.name,
        wins: 0,
        losses: 0,
        points: 0,
      })),
      matches: (l.matches ?? []).map((m) => ({
        ...m,
        player1: m.player1?.name ?? "",
        player2: m.player2?.name ?? "",
        onOpen: () => {
          props.dispatch([
            {
              type: "navigate",
              pageId: "match",
              params: { matchId: m.id },
            },
          ]);
        },
      })),
    })),
  };
};

function createMatches(players: Player[]): {
  id: string;
  player1Id: string;
  player2Id: string;
}[] {
  return uniqBy(
    players.flatMap((p) =>
      players
        .filter((p2) => p2.id !== p.id)
        .map((p2) => ({
          id: id(),
          player1Id: p.id,
          player2Id: p2.id,
        })),
    ),
    (m) => [m.player1Id, m.player2Id].sort().join(),
  );
}
