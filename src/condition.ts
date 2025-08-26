import { operators } from "./constants";
import { Operator } from "./types";

export type Condition = {
  field: string;
  operator: Operator;
  value: any;
};

function validateInputOperator(op: Operator) {
  if (!operators[op]) {
    throw new Error(
      `Invalid operator ${op}, allowed operators are ${Object.keys(
        operators
      ).join(", ")}`
    );
  }
}

function validateInputOperatorToValue(op: Operator, value: any) {
  switch (op) {
    case "in":
    case "nin":
      if (!Array.isArray(value)) {
        throw new Error(`Value must be an array for ${op} operator`);
      }
      break;
    case "like":
    case "nlike":
    case "sw":
    case "ew":
      if (typeof value !== "string") {
        throw new Error(`Value must be string for ${op} operator`);
      }
      break;
    case "eq":
    case "ne":
    case "gt":
    case "gte":
    case "lt":
    case "lte":
      if (typeof value !== "string" && typeof value !== "number") {
        throw new Error(`Value must be string or number for ${op} operator`);
      }
      break;
    case "is":
    case "isn":
      if (typeof value !== "boolean" && value !== null) {
        throw new Error(`Value must be boolean or null for ${op} operator`);
      }
      break;
    default:
      break;
  }
}

function getSqlPlaceholder(op: Operator, value: any) {
  switch (op) {
    case "like":
    case "nlike":
    case "sw":
    case "ew":
      return "upper(?)";
    case "in":
    case "nin":
      return `(${value.map(() => "?").join(", ")})`;
    default:
      return "?";
  }
}

function getField(field: string, op: Operator) {
  switch (op) {
    case "like":
    case "nlike":
    case "sw":
    case "ew":
      return `upper("${field}")`;

    default:
      return `"${field}"`;
  }
}

function getValue(value: any, op: Operator) {
  switch (op) {
    case "like":
    case "nlike":
      return `%${value}%`;
    case "sw":
      return `${value}%`;
    case "ew":
      return `%${value}`;
    default:
      return value;
  }
}

export function createCondition(
  field: string,
  operator: Operator,
  value: any
): Condition {
  validateInputOperator(operator);
  validateInputOperatorToValue(operator, value);

  return {
    field,
    operator,
    value,
  };
}

export function parseConditionSQL({ field, operator, value }: Condition) {
  const sql = `${getField(field, operator)} ${
    operators[operator]
  } ${getSqlPlaceholder(operator, value)}`;

  return {
    sql,
    value: getValue(value, operator),
  };
}
