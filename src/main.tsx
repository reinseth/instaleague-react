import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { id, init as initDb, type TransactionChunk } from "@instantdb/core";
import {
  type AppEvent,
  type AppStore,
  type DbEntity,
  type DbQuery,
  type DbQueryState,
  type DbSchema,
  type NavigateEvent,
  type Page,
  schema,
  type TransactEvent,
  type UpdateStoreEvent,
} from "./domain.ts";
import { produce } from "immer";
import { playersPage } from "./players/playersPage.tsx";
import UniversalRouter, { type RouteParams } from "universal-router";
import { isEqual } from "lodash";
import { leaguesPage } from "./leagues/leaguesPage.tsx";
import { matchPage } from "./match/matchPage.tsx";
import { leagueDetailsPage } from "./leagueDetails/leagueDetailsPage.tsx";
import generateUrls from "universal-router/generateUrls";

const pages = [playersPage, leaguesPage, leagueDetailsPage, matchPage];

const appId = import.meta.env.VITE_APP_ID;
const db = initDb({ appId, schema });
const root = createRoot(document.getElementById("root")!);
const router = new UniversalRouter<{ page: Page; params: RouteParams }>(
  pages.map((page) => ({
    name: page.id,
    path: page.route,
    action: (context) => ({ page: page as Page, params: context.params }),
  })),
  { errorHandler: () => null },
);
const pageUrl = generateUrls(router);

let routeMatch: { page: Page; params: RouteParams } | null = null;
let store: AppStore = {};
let dbState: {
  q?: DbQuery | null;
  sub?: DbQueryState<DbQuery>;
  unsubscribe?: () => void;
} = {};

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
        case "delete":
          return [op.action, op.entity, op.id, undefined];
        default:
          return [
            op.action,
            op.entity,
            op.id === "new-id" ? id() : op.id,
            op.data,
          ];
      }
    }),
  } as TransactionChunk<DbSchema, DbEntity>);
}

function handleNavigateEvent(event: NavigateEvent) {
  const url = pageUrl(event.pageId, event.params);
  console.log(url);
  window.history.pushState(null, "", url);
  handleRouteChange();
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
      case "navigate":
        handleNavigateEvent(event);
        break;
    }
  });
}

function render() {
  root.render(
    <StrictMode>
      {routeMatch?.page.render({
        dispatch,
        data: dbState?.sub?.data,
        store,
      })}
    </StrictMode>,
  );
}

function handleRouteChange() {
  console.log("handleRouteChange: ", window.location.pathname);
  router
    .resolve(window.location.pathname)
    .catch(() => null)
    .then((m) => {
      routeMatch = m as { page: Page; params: RouteParams } | null;
      const q = routeMatch?.page.query(routeMatch?.params);
      if (!isEqual(q, dbState?.q)) {
        dbState?.unsubscribe?.();
        dbState = { q };
        if (q) {
          dbState.unsubscribe = db.subscribeQuery(q, (data) => {
            if (dbState?.q === q) {
              dbState.sub = data;
              render();
            }
          });
        }
      }
      render();
    });
}

function init() {
  window.addEventListener("popstate", handleRouteChange);
  handleRouteChange();
}

init();
