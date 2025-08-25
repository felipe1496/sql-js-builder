const operators = {
  eq: "=",
  ne: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  in: "IN",
  nin: "NOT IN",
  like: "LIKE",
  nlike: "NOT LIKE",
  sw: "LIKE",
  ew: "LIKE",
  is: "IS",
  isn: "IS NOT",
};

export type Operator = keyof typeof operators;

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
    case "sw":
    case "ew":
      if (typeof value !== "string") {
        throw new Error(`Value must be string for ${op} operator`);
      }
      break;
    case "eq":
      if (typeof value !== "string" && typeof value !== "number") {
        throw new Error(`Value must be string or number for ${op} operator`);
      }
      break;
    default:
      break;
  }
}

function getSqlPlaceholder(op: Operator, value: any) {
  switch (op) {
    case "like":
      return `%?%`;
    case "sw":
      return `?%`;
    case "ew":
      return `%?`;
    default:
      return "?";
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
  const sql = `"${field}" ${operators[operator]} ${getSqlPlaceholder(
    operator,
    value
  )}`;
  return {
    sql,
    value,
  };
}
