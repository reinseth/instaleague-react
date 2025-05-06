import type {
  DbEntity,
  DbQuery,
  DbSchema,
  DeleteEntity,
  Page,
  TransactEvent,
  UpdateEntity,
  UpdateStoreEvent,
} from "./domain.ts";
import type { UpdateParams } from "@instantdb/core/src/schemaTypes.ts";

export function definePage<Q extends DbQuery>(page: Page<Q>): Page<Q> {
  return page;
}

export function updateStore(data: UpdateStoreEvent["data"]): UpdateStoreEvent {
  return { type: "update-store", data };
}

export function transact(
  ops: Array<UpdateEntity | DeleteEntity>,
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

export function deleteEntity<T extends DbEntity>(
  entity: T,
  id: string,
): DeleteEntity {
  return { action: "delete", entity, id };
}
