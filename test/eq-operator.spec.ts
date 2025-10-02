import { where } from "../src";

describe("Tests eq operator", () => {
  test("Regular eq value", () => {
    const { sql, values } = where().and("name", "eq", "john").build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 200, 0]);
  });

  test("Multiple eq condition on the same condition", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("email", "eq", "john@doe.com")
      .and("age", "eq", 23)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "name" = ? AND "email" = ? AND "age" = ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", "john@doe.com", 23, 200, 0]);
  });

  test("Test eq or conditions", () => {
    const { sql, values } = where()
      .or([
        ["name", "eq", "john"],
        ["name", "eq", "doe"],
      ])
      .build();
    expect(sql).toBe('1 = 1 AND ("name" = ? OR "name" = ?) LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", "doe", 200, 0]);
  });

  test("Tests or and and eq conditions on the same search", () => {
    const { sql, values } = where()
      .and("age", "eq", 32)
      .or([
        ["name", "eq", "john"],
        ["name", "eq", "doe"],
      ])
      .and("email", "eq", "john@doe.com")
      .build();
    expect(sql).toBe(
      '1 = 1 AND "age" = ? AND ("name" = ? OR "name" = ?) AND "email" = ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([32, "john", "doe", "john@doe.com", 200, 0]);
  });

  test("Error on pass array as value", () => {
    expect(() =>
      where()
        .and("name", "eq", "john")
        .and("email", "eq", "john@doe.com")
        .and("age", "eq", ["23"])
        .build()
    ).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "eq", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });

  test("On number value", () => {
    const { sql, values } = where().and("name", "eq", 3).build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual([3, 200, 0]);
  });
});
