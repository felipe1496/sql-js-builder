import { Operator, Where } from "./types";
import { escapeStr } from "./utils";
import { where } from "./where";

function getValue(value: string, op: Operator): any {
  console.log("value: ", value, op);
  switch (op) {
    case "is":
    case "isn":
      if (value.toLowerCase() === "null") return null;
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
      break;
    case "eq":
    case "ne":
    case "lt":
    case "lte":
    case "gt":
    case "gte":
    case "like":
    case "nlike":
    case "sw":
    case "ew":
      const isString = value.startsWith("'") && value.endsWith("'");
      if (isString) {
        return escapeStr(value);
      } else {
        const num = Number(value);
        if (!isNaN(num)) {
          return num;
        }
      }
      break;
    case "in":
    case "nin":
      if (value.startsWith("(") && value.endsWith(")")) {
        console.log("entrei aqui", value);
        const _value = value
          .slice(1, -1)
          .split(",")
          .map((v) => {
            const _v = v.trim();
            const isString = _v.startsWith("'") && _v.endsWith("'");
            if (isString) {
              return escapeStr(_v);
            } else {
              const num = Number(_v);
              if (!isNaN(num)) {
                return num;
              }
            }
          });
        return _value;
      }
      break;
    default:
      return value;
  }
}

export function parseStringToWhere(str: string): Where {
  const resultWhere = where();

  const andSplitted = str.split(" and ");

  if (!andSplitted.length) {
    return resultWhere;
  }

  andSplitted.forEach((c) => {
    const isOr = c.startsWith("(") && c.endsWith(")") && c.includes(" or ");
    if (isOr) {
      const strOrConds = c.slice(1, -1).split(" or ");
      const orConditions: [string, Operator, any][] = strOrConds.map(
        (orCond) => {
          const parts = str.split(" ");
          if (parts.length < 3) {
            throw new Error(`Invalid condition: ${orCond}`);
          }
          const [field, operator, value] = [
            parts[0],
            parts[1],
            parts[2],
            parts.slice(3).join(" "),
          ];

          return [
            field,
            operator as Operator,
            getValue(value, operator as Operator),
          ];
        }
      );
      resultWhere.or(orConditions);
    } else {
      const parts = c.split(" ");
      if (parts.length < 3) {
        throw new Error(`Invalid condition: ${c}`);
      }

      const [field, operator, value] = [
        parts[0],
        parts[1],
        parts.slice(2).join(" "),
      ];
      console.log("parts: ", field, operator, value);
      resultWhere.and(
        field,
        operator as Operator,
        getValue(value, operator as Operator)
      );
    }
  });

  return resultWhere;
}
