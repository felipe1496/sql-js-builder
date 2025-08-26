import { where } from "../src";

describe("Tests lte operator", () => {
  test("Regular lte condition", () => {
    const { sql, values } = where().and("age", "lte", 40).build();

    expect(sql).toBe('1 = 1 AND "age" <= ?');
    expect(values).toEqual([40]);
  });

  test("Multiple lte condition on the same condition", () => {
    const { sql, values } = where()
      .and("age", "lte", 23)
      .and("accounts", "lte", 3)
      .and("ranking", "lte", 10)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" <= ? AND "accounts" <= ? AND "ranking" <= ?'
    );
    expect(values).toEqual([23, 3, 10]);
  });

  test("Test lte or conditions", () => {
    const { sql, values } = where()
      .or([
        ["age", "lte", 23],
        ["accounts", "lte", 3],
      ])
      .build();
    expect(sql).toBe('1 = 1 AND ("age" <= ? OR "accounts" <= ?)');
    expect(values).toEqual([23, 3]);
  });

  test("Tests or and ne and conditions on the same search", () => {
    const { sql, values } = where()
      .and("ranking", "lte", 10)
      .or([
        ["age", "lte", 23],
        ["accounts", "lte", 3],
      ])
      .and("email", "lte", "a")
      .build();
    expect(sql).toBe(
      '1 = 1 AND "ranking" <= ? AND ("age" <= ? OR "accounts" <= ?) AND "email" <= ?'
    );
    expect(values).toEqual([10, 23, 3, "a"]);
  });

  test("Error on pass array as value", () => {
    expect(() =>
      where()
        .and("age", "lte", 23)
        .and("accounts", "lte", 3)
        .and("email", "lte", ["23"])
        .build()
    ).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "lte", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });

  test("On number value", () => {
    const { sql, values } = where().and("age", "lte", 3).build();

    expect(sql).toBe('1 = 1 AND "age" <= ?');
    expect(values).toEqual([3]);
  });
});
