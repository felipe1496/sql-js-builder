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
  const removeFilters: string[] = [];

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
      replace,
      orderBy,
      remove,
      findConditions,
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
      replace,
      orderBy,
      remove,
      findConditions,
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
      replace,
      orderBy,
      remove,
      findConditions,
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
      replace,
      orderBy,
      remove,
      findConditions,
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
      replace,
      orderBy,
      remove,
      findConditions,
    };
  }

  function replace(field: string, newField: string) {
    fieldReplacements[field] = newField;
    return {
      and,
      or,
      build,
      limit,
      offset,
      limitValue,
      offsetValue,
      replace,
      orderBy,
      remove,
      findConditions,
    };
  }

  function remove(field: string) {
    removeFilters.push(field);
    return {
      and,
      or,
      build,
      limit,
      offset,
      limitValue,
      offsetValue,
      replace,
      orderBy,
      remove,
      findConditions,
    };
  }

  function findConditions(
    field: string,
    operators?: Operator[] | undefined,
    options?: { includeOrGroups?: boolean }
  ): Condition[] {
    const includeOrGroups = options?.includeOrGroups ?? false;

    return conds.flatMap((cond) => {
      if (Array.isArray(cond)) {
        if (!includeOrGroups) return [];
        return cond.filter(
          (c) =>
            c.field === field &&
            (!operators || operators.includes(c.operator as Operator))
        );
      } else {
        if (
          cond.field === field &&
          (!operators || operators.includes(cond.operator as Operator))
        ) {
          return [cond];
        }
        return [];
      }
    });
  }

  function build() {
    const parsed = conds.map((c) => {
      if (Array.isArray(c)) {
        const orConditions = c
          .filter((orCond) => !removeFilters.includes(orCond.field))
          .map((orCond) => parseConditionSQL(orCond, fieldReplacements));

        if (orConditions.length) {
          return {
            sql: `(${orConditions.map((orCond) => orCond.sql).join(" OR ")})`,
            value: orConditions.map((orCond) => orCond.value),
          };
        }
      } else {
        if (!removeFilters.includes(c.field)) {
          return parseConditionSQL(c, fieldReplacements);
        }
      }
    });
    let sql = "1 = 1";
    const nonUndefinedParsed = parsed.filter(Boolean) as {
      sql: string;
      value: any;
    }[];
    if (nonUndefinedParsed.length) {
      sql += ` AND ${nonUndefinedParsed.map((p) => p.sql).join(" AND ")}`;
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
        ...nonUndefinedParsed.map((p) => p.value).flat(Infinity),
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
    replace,
    orderBy,
    remove,
    findConditions,
  };
}
