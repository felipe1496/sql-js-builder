import { where } from "../src";

describe("Tests gt operator", () => {
  test("Regular gt condition", () => {
    const { sql, values } = where().and("age", "gt", 40).build();

    expect(sql).toBe('1 = 1 AND "age" > ? LIMIT ? OFFSET ?');
    expect(values).toEqual([40, 201, 0]);
  });

  test("Multiple gt condition on the same condition", () => {
    const { sql, values } = where()
      .and("age", "gt", 23)
      .and("accounts", "gt", 3)
      .and("ranking", "gt", 10)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" > ? AND "accounts" > ? AND "ranking" > ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([23, 3, 10, 201, 0]);
  });

  test("Test gt or conditions", () => {
    const { sql, values } = where()
      .or([
        ["age", "gt", 23],
        ["accounts", "gt", 3],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND ("age" > ? OR "accounts" > ?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([23, 3, 201, 0]);
  });

  test("Tests or and ne and conditions on the same search", () => {
    const { sql, values } = where()
      .and("ranking", "gt", 10)
      .or([
        ["age", "gt", 23],
        ["accounts", "gt", 3],
      ])
      .and("email", "gt", "a")
      .build();
    expect(sql).toBe(
      '1 = 1 AND "ranking" > ? AND ("age" > ? OR "accounts" > ?) AND "email" > ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([10, 23, 3, "a", 201, 0]);
  });

  test("Error on pass array as value", () => {
    expect(() =>
      where()
        .and("age", "gt", 23)
        .and("accounts", "gt", 3)
        .and("email", "gt", ["23"])
        .build()
    ).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "gt", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });

  test("On number value", () => {
    const { sql, values } = where().and("age", "gt", 3).build();

    expect(sql).toBe('1 = 1 AND "age" > ? LIMIT ? OFFSET ?');
    expect(values).toEqual([3, 201, 0]);
  });
});
