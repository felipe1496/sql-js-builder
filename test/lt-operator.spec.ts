import { where } from "../src";

describe("Tests lt operator", () => {
  test("Regular lt condition", () => {
    const { sql, values } = where().and("age", "lt", 40).build();

    expect(sql).toBe('1 = 1 AND "age" < ?');
    expect(values).toEqual([40]);
  });

  test("Multiple lt condition on the same condition", () => {
    const { sql, values } = where()
      .and("age", "lt", 23)
      .and("accounts", "lt", 3)
      .and("ranking", "lt", 10)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" < ? AND "accounts" < ? AND "ranking" < ?'
    );
    expect(values).toEqual([23, 3, 10]);
  });

  test("Test lt or conditions", () => {
    const { sql, values } = where()
      .or([
        ["age", "lt", 23],
        ["accounts", "lt", 3],
      ])
      .build();
    expect(sql).toBe('1 = 1 AND ("age" < ? OR "accounts" < ?)');
    expect(values).toEqual([23, 3]);
  });

  test("Tests or and ne and conditions on the same search", () => {
    const { sql, values } = where()
      .and("ranking", "lt", 10)
      .or([
        ["age", "lt", 23],
        ["accounts", "lt", 3],
      ])
      .and("email", "lt", "a")
      .build();
    expect(sql).toBe(
      '1 = 1 AND "ranking" < ? AND ("age" < ? OR "accounts" < ?) AND "email" < ?'
    );
    expect(values).toEqual([10, 23, 3, "a"]);
  });

  test("Error on pass array as value", () => {
    expect(() =>
      where()
        .and("age", "lt", 23)
        .and("accounts", "lt", 3)
        .and("email", "lt", ["23"])
        .build()
    ).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "lt", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });

  test("On number value", () => {
    const { sql, values } = where().and("age", "lt", 3).build();

    expect(sql).toBe('1 = 1 AND "age" < ?');
    expect(values).toEqual([3]);
  });
});
