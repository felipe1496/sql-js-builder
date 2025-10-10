import { Condition, createCondition, parseConditionSQL } from "./condition";
import { parseStringToWhere } from "./parse-string-to-where";
import { Operator, Where } from "./types";

export function where(str?: string): Where {
  if (str) {
    return parseStringToWhere(str);
  }
  let limitValue = 201;
  let offsetValue = 0;
  const conds: (Condition | Condition[])[] = [];
  const fieldReplacements: Record<string, string> = {};
  const orderByValues: Record<string, "asc" | "desc"> = {};

  function orderBy(field: string, order: "asc" | "desc") {
    orderByValues[field] = order;
    return {
      and,
      or,
      build,
      limit,
      offset,
      limitValue,
      offsetValue,
      replaceField,
      orderBy,
    };
  }

  function and(field: string, operator: Operator, value: any) {
    conds.push(createCondition(field, operator, value));
    return {
      and,
      or,
      build,
      limit,
      offset,
      limitValue,
      offsetValue,
      replaceField,
      orderBy,
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
      limit,
      offset,
      limitValue,
      offsetValue,
      replaceField,
      orderBy,
    };
  }

  function limit(newLimit: number) {
    if (newLimit < 0) {
      throw new Error("Page must be greater than 0");
    }
    limitValue = newLimit;
    return {
      and,
      or,
      build,
      limit,
      offset,
      limitValue,
      offsetValue,
      replaceField,
      orderBy,
    };
  }

  function offset(newOffset: number) {
    if (newOffset < 0) {
      throw new Error("PerPage must be greater than 0");
    }
    offsetValue = newOffset;
    return {
      and,
      or,
      build,
      limit,
      offset,
      limitValue,
      offsetValue,
      replaceField,
      orderBy,
    };
  }

  function replaceField(field: string, newField: string) {
    fieldReplacements[field] = newField;
    return {
      and,
      or,
      build,
      limit,
      offset,
      limitValue,
      offsetValue,
      replaceField,
      orderBy,
    };
  }

  function build() {
    const parsed = conds.map((c) => {
      if (Array.isArray(c)) {
        const orConditions = c.map((orCond) =>
          parseConditionSQL(orCond, fieldReplacements)
        );

        return {
          sql: `(${orConditions.map((orCond) => orCond.sql).join(" OR ")})`,
          value: orConditions.map((orCond) => orCond.value),
        };
      } else {
        return parseConditionSQL(c, fieldReplacements);
      }
    });
    let sql = "1 = 1";
    if (parsed.length) {
      sql += ` AND ${parsed.map((p) => p.sql).join(" AND ")}`;
    }
    sql += ` LIMIT ? OFFSET ?`;

    if (Object.keys(orderByValues).length) {
      sql += ` ORDER BY ${Object.entries(orderByValues)
        .map(([field, order]) => `${field} ${order}`)
        .join(", ")}`;
    }

    return {
      sql,
      values: [
        ...parsed.map((p) => p.value).flat(Infinity),
        limitValue,
        offsetValue,
      ],
    };
  }

  return {
    and,
    or,
    build,
    limit,
    offset,
    limitValue,
    offsetValue,
    replaceField,
    orderBy,
  };
}
