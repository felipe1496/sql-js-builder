import { where } from "../src";

describe("Tests in operator", () => {
  test("Regular in condition", () => {
    const { sql, values } = where().and("age", "in", [40, 32, 80]).build();

    expect(sql).toBe('1 = 1 AND "age" IN (?, ?, ?) LIMIT ? OFFSET ?');
    expect(values).toEqual([40, 32, 80, 200, 0]);
  });

  test("Multiple in condition on the same condition", () => {
    const { sql, values } = where()
      .and("age", "in", [40, 32, 80])
      .and("email", "in", ["john@doe.com"])
      .and("rank", "in", ["gold", "silver"])
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" IN (?, ?, ?) AND "email" IN (?) AND "rank" IN (?, ?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([
      40,
      32,
      80,
      "john@doe.com",
      "gold",
      "silver",
      200,
      0,
    ]);
  });

  test("Test in or conditions", () => {
    const { sql, values } = where()
      .or([
        ["age", "in", [40, 32, 80]],
        ["email", "in", ["john@doe.com"]],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND ("age" IN (?, ?, ?) OR "email" IN (?)) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([40, 32, 80, "john@doe.com", 200, 0]);
  });

  test("Tests or and in and conditions on the same search", () => {
    const { sql, values } = where()
      .and("ranking", "in", [10, 9, 8])
      .or([
        ["age", "in", [40, 32, 80]],
        ["email", "in", ["john@doe.com"]],
      ])
      .and("email", "in", ["john@doe.com"])
      .build();
    expect(sql).toBe(
      '1 = 1 AND "ranking" IN (?, ?, ?) AND ("age" IN (?, ?, ?) OR "email" IN (?)) AND "email" IN (?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([
      10,
      9,
      8,
      40,
      32,
      80,
      "john@doe.com",
      "john@doe.com",
      200,
      0,
    ]);
  });

  test("Error on pass number as value", () => {
    expect(() => where().and("age", "in", 23).build()).toThrow(Error);
  });

  test("Error on pass string as value", () => {
    expect(() => where().and("age", "in", "23").build()).toThrow(Error);
  });

  test("Error on pass true as value", () => {
    expect(() => where().and("age", "in", true).build()).toThrow(Error);
  });

  test("Error on pass null as value", () => {
    expect(() => where().and("age", "in", null).build()).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "in", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });
});
