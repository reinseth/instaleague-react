import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { type TransactionChunk, init as initDb, id } from "@instantdb/core";
import {
  type AppEvent,
  type AppStore,
  type DbEntity,
  type DbQuery,
  type DbQueryState,
  type DbSchema,
  type Page,
  schema,
  type TransactEvent,
  type UpdateStoreEvent,
} from "./domain.ts";
import { produce } from "immer";
import { playersPage } from "./players/playersPage.tsx";

const appId = import.meta.env.VITE_APP_ID;
const db = initDb({ appId, schema });
const root = createRoot(document.getElementById("root")!);

let store: AppStore = {};
let dbState:
  | {
      q: DbQuery;
      sub?: DbQueryState<DbQuery>;
      unsubscribe: () => void;
    }
  | undefined = undefined;

function handleUpdateStoreEvent(event: UpdateStoreEvent) {
  store = produce(store, (draft) => {
    Object.entries(event.data).forEach(([k, v]) => {
      draft[k as keyof AppStore] =
        typeof v === "function" ? v(draft[k as keyof AppStore]) : v;
    });
  });
  render();
}

function handleTransactEvent(event: TransactEvent) {
  db.transact({
    __ops: event.ops.map((op) => {
      switch (op.action) {
        case "update":
          return [
            op.action,
            op.entity,
            op.id === "new-id" ? id() : op.id,
            op.data,
          ];
        case "delete":
          return [op.action, op.entity, op.id, undefined];
      }
    }),
  } as TransactionChunk<DbSchema, DbEntity>);
}

function dispatch(events: AppEvent[]) {
  events.forEach((event) => {
    console.log(event);
    switch (event.type) {
      case "update-store":
        handleUpdateStoreEvent(event);
        break;
      case "transact":
        handleTransactEvent(event);
        break;
    }
  });
}

function currentPage(): Page<DbQuery> {
  return playersPage as Page<DbQuery>;
}

function render() {
  root.render(
    <StrictMode>
      {currentPage().render({ dispatch, data: dbState?.sub?.data, store })}
    </StrictMode>,
  );
}

function init() {
  const page = currentPage();
  const q = page.query();
  dbState = {
    q,
    unsubscribe: db.subscribeQuery(q, (data) => {
      if (dbState?.q === q) {
        dbState.sub = data;
        render();
      }
    }),
  };
  render();
}

init();
