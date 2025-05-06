import {
  i,
  type InstaQLEntity,
  type InstaQLParams,
  type InstaQLSubscriptionState,
} from "@instantdb/core";
import type { ReactElement } from "react";
import type { UpdateParams } from "@instantdb/core/src/schemaTypes.ts";
import type { PlayersState } from "./players/playersDomain.ts";

export const schema = i.schema({
  entities: {
    players: i.entity({
      name: i.string().unique().indexed(),
      email: i.string().unique().indexed(),
    }),
    leagues: i.entity({
      name: i.string().unique().indexed(),
    }),
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

export type AppStore = PlayersState;

export type PageProps<Q extends DbQuery> = {
  dispatch: EventDispatcher;
  data?: DbQueryState<Q>["data"];
  store: AppStore;
};

export type Page<Q extends DbQuery> = {
  id: string;
  route: string;
  query: () => Q;
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
  ops: Array<UpdateEntity | DeleteEntity>;
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

// "link" | "unlink"

export type AppEvent = UpdateStoreEvent | TransactEvent;

export type EventDispatcher = (events: AppEvent[]) => void;
