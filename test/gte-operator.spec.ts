import { where } from "../src";

describe("Tests gte operator", () => {
  test("Regular gte condition", () => {
    const { sql, values } = where().and("age", "gte", 40).build();

    expect(sql).toBe('1 = 1 AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual([40, 201, 0]);
  });

  test("Multiple gte condition on the same condition", () => {
    const { sql, values } = where()
      .and("age", "gte", 23)
      .and("accounts", "gte", 3)
      .and("ranking", "gte", 10)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" >= ? AND "accounts" >= ? AND "ranking" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([23, 3, 10, 201, 0]);
  });

  test("Test gte or conditions", () => {
    const { sql, values } = where()
      .or([
        ["age", "gte", 23],
        ["accounts", "gte", 3],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND ("age" >= ? OR "accounts" >= ?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([23, 3, 201, 0]);
  });

  test("Tests or and ne and conditions on the same search", () => {
    const { sql, values } = where()
      .and("ranking", "gte", 10)
      .or([
        ["age", "gte", 23],
        ["accounts", "gte", 3],
      ])
      .and("email", "gte", "a")
      .build();
    expect(sql).toBe(
      '1 = 1 AND "ranking" >= ? AND ("age" >= ? OR "accounts" >= ?) AND "email" >= ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([10, 23, 3, "a", 201, 0]);
  });

  test("Error on pass array as value", () => {
    expect(() =>
      where()
        .and("age", "gte", 23)
        .and("accounts", "gte", 3)
        .and("email", "gte", ["23"])
        .build()
    ).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "gte", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });

  test("On number value", () => {
    const { sql, values } = where().and("age", "gte", 3).build();

    expect(sql).toBe('1 = 1 AND "age" >= ? LIMIT ? OFFSET ?');
    expect(values).toEqual([3, 201, 0]);
  });
});
