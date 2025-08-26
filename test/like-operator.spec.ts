import { where } from "../src";

describe("Tests like operator", () => {
  test("Regular like value", () => {
    const { sql, values } = where().and("name", "like", "john").build();

    expect(sql).toBe(`1 = 1 AND upper("name") LIKE upper(?)`);
    expect(values).toEqual(["%john%"]);
  });

  test("Multiple like condition on the same condition", () => {
    const { sql, values } = where()
      .and("name", "like", "john")
      .and("email", "like", "john@d")
      .build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") LIKE upper(?) AND upper("email") LIKE upper(?)'
    );
    expect(values).toEqual(["%john%", "%john@d%"]);
  });

  test("Test like or conditions", () => {
    const { sql, values } = where()
      .or([
        ["name", "like", "john"],
        ["name", "like", "doe"],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND (upper("name") LIKE upper(?) OR upper("name") LIKE upper(?))'
    );
    expect(values).toEqual(["%john%", "%doe%"]);
  });

  test("Tests or and and eq conditions on the same search", () => {
    const { sql, values } = where()
      .and("age", "like", "32")
      .or([
        ["name", "like", "john"],
        ["name", "like", "doe"],
      ])
      .and("email", "like", "john@doe")
      .build();
    expect(sql).toBe(
      '1 = 1 AND upper("age") LIKE upper(?) AND (upper("name") LIKE upper(?) OR upper("name") LIKE upper(?)) AND upper("email") LIKE upper(?)'
    );
    expect(values).toEqual(["%32%", "%john%", "%doe%", "%john@doe%"]);
  });

  test("Error on pass array as value", () => {
    expect(() => where().and("age", "like", ["23"]).build()).toThrow(Error);
  });

  test("Error on pass number as value", () => {
    expect(() => where().and("age", "in", 23).build()).toThrow(Error);
  });

  test("Error on pass true as value", () => {
    expect(() => where().and("age", "in", true).build()).toThrow(Error);
  });

  test("Error on pass null as value", () => {
    expect(() => where().and("age", "in", null).build()).toThrow(Error);
  });
});
