import { Condition, createCondition, parseConditionSQL } from "./condition";
import { parseStringToWhere } from "./parse-string-to-where";
import { Operator, Where } from "./types";

export function where(str?: string): Where {
  if (str) {
    return parseStringToWhere(str);
  }
  let pageValue = 1;
  let perPageValue = 201;
  const conds: (Condition | Condition[])[] = [];

  function and(field: string, operator: Operator, value: any) {
    conds.push(createCondition(field, operator, value));
    return {
      and,
      or,
      build,
      page,
      perPage,
      pageValue,
      perPageValue,
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
      page,
      perPage,
      pageValue,
      perPageValue,
    };
  }

  function page(newPage: number) {
    if (newPage <= 0) {
      throw new Error("Page must be greater than 0");
    }
    pageValue = newPage;
    return {
      and,
      or,
      build,
      page,
      perPage,
      pageValue,
      perPageValue,
    };
  }

  function perPage(newPerPage: number) {
    if (newPerPage <= 0) {
      throw new Error("PerPage must be greater than 0");
    }
    perPageValue = newPerPage;
    return {
      and,
      or,
      build,
      page,
      perPage,
      pageValue,
      perPageValue,
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
    sql += ` LIMIT ? OFFSET ?`;

    return {
      sql,
      values: [
        ...parsed.map((p) => p.value).flat(Infinity),
        perPageValue,
        (pageValue - 1) * perPageValue,
      ],
    };
  }

  return {
    and,
    or,
    build,
    page,
    perPage,
    pageValue,
    perPageValue,
  };
}
