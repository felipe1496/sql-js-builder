import { parseStringToWhere } from "../src/parse-string-to-where";

describe("Tests parse string to where structure", () => {
  test("Regular eq conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name eq 'john' and age gte 25"
    ).build();

    expect(sql).toBe('1 = 1 AND "name" = ? AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 25, 200, 0]);
  });

  test("Regular ne conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name ne 'john' and age gte 25"
    ).build();

    expect(sql).toBe('1 = 1 AND "name" != ? AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 25, 200, 0]);
  });

  test("Regular gt conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name gt 'john' and age gte 25"
    ).build();

    expect(sql).toBe('1 = 1 AND "name" > ? AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 25, 200, 0]);
  });

  test("Regular gte conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name gte 'john' and age gte 25"
    ).build();

    expect(sql).toBe('1 = 1 AND "name" >= ? AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 25, 200, 0]);
  });

  test("Regular lt conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name lt 'john' and age gte 25"
    ).build();

    expect(sql).toBe('1 = 1 AND "name" < ? AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 25, 200, 0]);
  });

  test("Regular lte conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name lte 'john' and age gte 25"
    ).build();

    expect(sql).toBe('1 = 1 AND "name" <= ? AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 25, 200, 0]);
  });

  test("Regular in conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name in ('john', 'doe') and age gte 25"
    ).build();

    expect(sql).toBe(
      '1 = 1 AND "name" IN (?, ?) AND "age" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", "doe", 25, 200, 0]);
  });

  test("Regular not in conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name nin ('john', 'doe') and age gte 25"
    ).build();

    expect(sql).toBe(
      '1 = 1 AND "name" NOT IN (?, ?) AND "age" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", "doe", 25, 200, 0]);
  });

  test("Regular is conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name is null and age gte 25"
    ).build();

    expect(sql).toBe('1 = 1 AND "name" IS ? AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual([null, 25, 200, 0]);
  });

  test("Regular is not conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name isn null and age gte 25"
    ).build();

    expect(sql).toBe(
      '1 = 1 AND "name" IS NOT ? AND "age" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([null, 25, 200, 0]);
  });

  test("Regular like conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name like 'john' and age gte 25"
    ).build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") LIKE upper(?) AND "age" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john%", 25, 200, 0]);
  });

  test("Regular not like conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name nlike 'john' and age gte 25"
    ).build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") NOT LIKE upper(?) AND "age" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john%", 25, 200, 0]);
  });

  test("Regular starts with conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name sw 'john' and age gte 25"
    ).build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") LIKE upper(?) AND "age" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john%", 25, 200, 0]);
  });

  test("Regular ends with conditions", () => {
    const { sql, values } = parseStringToWhere(
      "name ew 'john' and age gte 25"
    ).build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") LIKE upper(?) AND "age" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john", 25, 200, 0]);
  });
});
