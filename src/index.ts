import {
  Condition,
  createCondition,
  Operator,
  parseConditionSQL,
} from "./condition";

export function searchjs() {
  const andConds: Condition[] = [];
  const orConds = [];

  function and(field: string, operator: Operator, value: any) {
    andConds.push(createCondition(field, operator, value));
    return {
      and,
      or,
      build,
    };
  }

  function or() {}

  function build() {
    const parsed = andConds.map(parseConditionSQL);
    let sql = "1 = 1";
    if (parsed.length) {
      sql += ` AND ${parsed.map((p) => p.sql).join(" AND ")}`;
    }
    return {
      sql,
      values: parsed.map((p) => p.value).flat(),
    };
  }

  return {
    and,
    or,
    build,
  };
}
