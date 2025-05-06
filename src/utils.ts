import { compact, flattenDeep } from "lodash";

export const classNames = (...names: unknown[]): string => compact(flattenDeep(names)).join(" ");
