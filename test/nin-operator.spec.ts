import { where } from "../src";

describe("Tests not in operator", () => {
  test("Regular not in condition", () => {
    const { sql, values } = where().and("age", "nin", [40, 32, 80]).build();

    expect(sql).toBe('1 = 1 AND "age" NOT IN (?, ?, ?)');
    expect(values).toEqual([40, 32, 80]);
  });

  test("Multiple not in condition on the same condition", () => {
    const { sql, values } = where()
      .and("age", "nin", [40, 32, 80])
      .and("email", "nin", ["john@doe.com"])
      .and("rank", "nin", ["gold", "silver"])
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" NOT IN (?, ?, ?) AND "email" NOT IN (?) AND "rank" NOT IN (?, ?)'
    );
    expect(values).toEqual([40, 32, 80, "john@doe.com", "gold", "silver"]);
  });

  test("Test not in or conditions", () => {
    const { sql, values } = where()
      .or([
        ["age", "nin", [40, 32, 80]],
        ["email", "nin", ["john@doe.com"]],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND ("age" NOT IN (?, ?, ?) OR "email" NOT IN (?))'
    );
    expect(values).toEqual([40, 32, 80, "john@doe.com"]);
  });

  test("Tests or and not in and conditions on the same search", () => {
    const { sql, values } = where()
      .and("ranking", "nin", [10, 9, 8])
      .or([
        ["age", "nin", [40, 32, 80]],
        ["email", "nin", ["john@doe.com"]],
      ])
      .and("email", "nin", ["john@doe.com"])
      .build();
    expect(sql).toBe(
      '1 = 1 AND "ranking" NOT IN (?, ?, ?) AND ("age" NOT IN (?, ?, ?) OR "email" NOT IN (?)) AND "email" NOT IN (?)'
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
    ]);
  });

  test("Error on pass number as value", () => {
    expect(() => where().and("age", "nin", 23).build()).toThrow(Error);
  });

  test("Error on pass string as value", () => {
    expect(() => where().and("age", "nin", "23").build()).toThrow(Error);
  });

  test("Error on pass true as value", () => {
    expect(() => where().and("age", "nin", true).build()).toThrow(Error);
  });

  test("Error on pass null as value", () => {
    expect(() => where().and("age", "nin", null).build()).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "nin", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });
});
