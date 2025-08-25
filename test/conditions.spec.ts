import { searchjs } from "../src";

describe("tests eq operator", () => {
  test("regular eq value", () => {
    const { sql, values } = searchjs().and("name", "eq", "john").build();

    expect(sql).toBe('1 = 1 AND "name" = ?');
    expect(values).toEqual(["john"]);
  });

  test("multiple eq condition on the same condition", () => {
    const { sql, values } = searchjs()
      .and("name", "eq", "john")
      .and("email", "eq", "john@doe.com")
      .and("age", "eq", 23)
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? AND "email" = ? AND "age" = ?');
    expect(values).toEqual(["john", "john@doe.com", 23]);
  });

  test("error on pass array as value", () => {
    expect(() =>
      searchjs()
        .and("name", "eq", "john")
        .and("email", "eq", "john@doe.com")
        .and("age", "eq", ["23"])
        .build()
    ).toThrow(Error);
  });

  test("on no conditions", () => {
    const { sql, values } = searchjs().build();

    expect(sql).toBe("1 = 1");
    expect(values).toEqual([]);
  });

  test("on number value", () => {
    const { sql, values } = searchjs().and("name", "eq", 3).build();

    expect(sql).toBe('1 = 1 AND "name" = ?');
    expect(values).toEqual([3]);
  });
});

describe("tests ne operator", () => {
  test("regular ne value", () => {
    const { sql, values } = searchjs().and("name", "ne", "john").build();

    expect(sql).toBe('1 = 1 AND "name" != ?');
    expect(values).toEqual(["john"]);
  });
});
