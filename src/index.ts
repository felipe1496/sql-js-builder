import {
  Condition,
  createCondition,
  Operator,
  parseConditionSQL,
} from "./condition";

export function searchjs() {
  const conds: (Condition | Condition[])[] = [];

  function and(field: string, operator: Operator, value: any) {
    conds.push(createCondition(field, operator, value));
    return {
      and,
      or,
      build,
    };
  }

  function or(orConditions: [string, Operator, any][]) {
    conds.push(
      orConditions.map(([field, operator, value]) =>
        createCondition(field, operator, value)
      )
    );
    return {
      and,
      or,
      build,
    };
  }

  function build() {
    const parsed = conds.map((c) => {
      if (Array.isArray(c)) {
        const orConditions = c.map((orCond) => parseConditionSQL(orCond));
        return {
          sql: `(${orConditions.map((orCond) => orCond.sql).join(" OR ")})`,
          value: orConditions.map((orCond) => orCond.value),
        };
      } else {
        return parseConditionSQL(c);
      }
    });
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
