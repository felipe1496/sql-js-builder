import { operators } from "./constants";

export type Operator = keyof typeof operators;

export type Where = {
  and: (field: string, operator: Operator, value: any) => Where;
  or: (orConditions: [string, Operator, any][]) => Where;
  build: () => { sql: string; values: any[] };
  limit: (newLimitValue: number) => Where;
  offset: (newOffsetValue: number) => Where;
  limitValue: number;
  offsetValue: number;
  replace: (field: string, newField: string) => Where;
  orderBy: (field: string, order: "asc" | "desc") => Where;
  remove: (field: string) => Where;
  exists: (field: string) => boolean;
};
