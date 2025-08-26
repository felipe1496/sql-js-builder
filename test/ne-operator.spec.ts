import { where } from "../src";

describe("Tests ne operator", () => {
  test("Regular ne value", () => {
    const { sql, values } = where().and("name", "ne", "john").build();

    expect(sql).toBe('1 = 1 AND "name" != ?');
    expect(values).toEqual(["john"]);
  });

  test("Multiple ne condition on the same condition", () => {
    const { sql, values } = where()
      .and("name", "ne", "john")
      .and("email", "ne", "john@doe.com")
      .and("age", "ne", 23)
      .build();

    expect(sql).toBe('1 = 1 AND "name" != ? AND "email" != ? AND "age" != ?');
    expect(values).toEqual(["john", "john@doe.com", 23]);
  });

  test("Test ne or conditions", () => {
    const { sql, values } = where()
      .or([
        ["name", "ne", "john"],
        ["name", "ne", "doe"],
      ])
      .build();
    expect(sql).toBe('1 = 1 AND ("name" != ? OR "name" != ?)');
    expect(values).toEqual(["john", "doe"]);
  });

  test("Tests or and ne and conditions on the same search", () => {
    const { sql, values } = where()
      .and("age", "ne", 32)
      .or([
        ["name", "ne", "john"],
        ["name", "ne", "doe"],
      ])
      .and("email", "ne", "john@doe.com")
      .build();
    expect(sql).toBe(
      '1 = 1 AND "age" != ? AND ("name" != ? OR "name" != ?) AND "email" != ?'
    );
    expect(values).toEqual([32, "john", "doe", "john@doe.com"]);
  });

  test("Error on pass array as value", () => {
    expect(() =>
      where()
        .and("name", "ne", "john")
        .and("email", "ne", "john@doe.com")
        .and("age", "ne", ["23"])
        .build()
    ).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "ne", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });

  test("On number value", () => {
    const { sql, values } = where().and("name", "ne", 3).build();

    expect(sql).toBe('1 = 1 AND "name" != ?');
    expect(values).toEqual([3]);
  });
});
