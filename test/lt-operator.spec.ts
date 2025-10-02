import { where } from "../src";

describe("Tests lt operator", () => {
  test("Regular lt condition", () => {
    const { sql, values } = where().and("age", "lt", 40).build();

    expect(sql).toBe('1 = 1 AND "age" < ? LIMIT ? OFFSET ?');
    expect(values).toEqual([40, 200, 0]);
  });

  test("Multiple lt condition on the same condition", () => {
    const { sql, values } = where()
      .and("age", "lt", 23)
      .and("accounts", "lt", 3)
      .and("ranking", "lt", 10)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" < ? AND "accounts" < ? AND "ranking" < ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([23, 3, 10, 200, 0]);
  });

  test("Test lt or conditions", () => {
    const { sql, values } = where()
      .or([
        ["age", "lt", 23],
        ["accounts", "lt", 3],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND ("age" < ? OR "accounts" < ?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([23, 3, 200, 0]);
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
      '1 = 1 AND "ranking" < ? AND ("age" < ? OR "accounts" < ?) AND "email" < ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([10, 23, 3, "a", 200, 0]);
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

    expect(sql).toBe('1 = 1 AND "age" < ? LIMIT ? OFFSET ?');
    expect(values).toEqual([3, 200, 0]);
  });
});
