import type {
  DbEntity,
  DbQuery,
  DbSchema,
  DeleteEntity,
  LinkEntity,
  Page,
  TransactEvent,
  UnlinkEntity,
  UpdateEntity,
  UpdateStoreEvent,
} from "./domain.ts";
import type { UpdateParams } from "@instantdb/core/src/schemaTypes.ts";
import type { LinkParams } from "@instantdb/core";

export function definePage<Q extends DbQuery>(page: Page<Q>): Page<Q> {
  return page;
}

export function updateStore(data: UpdateStoreEvent["data"]): UpdateStoreEvent {
  return { type: "update-store", data };
}

export function transact(
  ops: Array<UpdateEntity | DeleteEntity | LinkEntity | UnlinkEntity>,
): TransactEvent {
  return { type: "transact", ops };
}

export function updateEntity<T extends DbEntity>(
  entity: T,
  id: "new-id" | string,
  data: UpdateParams<DbSchema, T>,
): UpdateEntity {
  return { action: "update", entity, id, data };
}

export function linkEntity<T extends DbEntity>(
  entity: T,
  id: "new-id" | string,
  data: LinkParams<DbSchema, T>,
): LinkEntity {
  return { action: "link", entity, id, data };
}

export function deleteEntity<T extends DbEntity>(
  entity: T,
  id: string,
): DeleteEntity {
  return { action: "delete", entity, id };
}
