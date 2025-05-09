import {
  i,
  type InstaQLEntity,
  type InstaQLParams,
  type InstaQLSubscriptionState,
  type LinkParams,
} from "@instantdb/core";
import type { ReactElement } from "react";
import type { UpdateParams } from "@instantdb/core/src/schemaTypes.ts";
import type { PlayersState } from "./players/playersDomain.ts";
import type { LeaguesState } from "./leagues/leaguesDomain.ts";

export const schema = i.schema({
  entities: {
    players: i.entity({
      name: i.string().unique(),
    }),
    leagues: i.entity({
      name: i.string().unique(),
    }),
    matches: i.entity({
      score1: i.number().optional(),
      score2: i.number().optional(),
      finished: i.boolean().optional(),
    }),
  },
  links: {
    leaguePlayers: {
      forward: { on: "leagues", has: "many", label: "players" },
      reverse: { on: "players", has: "many", label: "leagues" },
    },
    leagueMatches: {
      forward: { on: "leagues", has: "many", label: "matches" },
      reverse: { on: "matches", has: "one", label: "leagues" },
    },
    matchPlayer1: {
      forward: { on: "matches", has: "one", label: "player1" },
      reverse: { on: "players", has: "many", label: "matches1" },
    },
    matchPlayer2: {
      forward: { on: "matches", has: "one", label: "player2" },
      reverse: { on: "players", has: "many", label: "matches2" },
    },
  },
});

export type DbSchema = typeof schema;

export type DbEntity = keyof DbSchema["entities"];

export type DbQuery = InstaQLParams<DbSchema>;

export type DbQueryState<Q extends DbQuery> = InstaQLSubscriptionState<
  DbSchema,
  Q
>;

export type Player = InstaQLEntity<DbSchema, "players">;
export type Match = InstaQLEntity<DbSchema, "matches">;

export type League = InstaQLEntity<DbSchema, "leagues">;

export type Match = InstaQLEntity<DbSchema, "matches">;

export type AppStore = PlayersState & LeaguesState;

export type PageProps<Q extends DbQuery> = {
  dispatch: EventDispatcher;
  data?: DbQueryState<Q>["data"];
  store: AppStore;
};

export type Page<Q extends DbQuery = DbQuery> = {
  id: string;
  route: string;
  query: (params: { [paramName: string]: string | string[] }) => Q;
  render: (props: PageProps<Q>) => ReactElement;
};

export type UpdateStoreEvent = {
  type: "update-store";
  data: {
    [K in keyof AppStore]?: AppStore[K] | ((cur: AppStore[K]) => AppStore[K]);
  };
};

export type TransactEvent = {
  type: "transact";
  ops: Array<UpdateEntity | DeleteEntity | LinkEntity | UnlinkEntity>;
};

export type UpdateEntity = {
  action: "update";
  entity: DbEntity;
  id: "new-id" | string;
  data: UpdateParams<DbSchema, DbEntity>;
};

export type DeleteEntity = {
  action: "delete";
  entity: DbEntity;
  id: string;
};

export type LinkEntity = {
  action: "link";
  entity: DbEntity;
  id: string;
  data: LinkParams<DbSchema, DbEntity>;
};

export type UnlinkEntity = {
  action: "unlink";
  entity: DbEntity;
  id: string;
  data: LinkParams<DbSchema, DbEntity>;
};

export type NavigateEvent = {
  type: "navigate";
  pageId: string;
  params?: { [paramName: string]: string | string[] };
};

export type AppEvent = UpdateStoreEvent | TransactEvent | NavigateEvent;

export type EventDispatcher = (events: AppEvent[]) => void;
