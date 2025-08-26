import { operators } from "./constants";

export type Operator = keyof typeof operators;

export type Where = {
  and: (field: string, operator: Operator, value: any) => Where;
  or: (orConditions: [string, Operator, any][]) => Where;
  build: () => { sql: string; values: any[] };
};
