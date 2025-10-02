import { where } from "../src";

describe("Tests like operator", () => {
  test("Regular like value", () => {
    const { sql, values } = where().and("name", "like", "john").build();

    expect(sql).toBe(`1 = 1 AND upper("name") LIKE upper(?) LIMIT ? OFFSET ?`);
    expect(values).toEqual(["%john%", 201, 0]);
  });

  test("Multiple like condition on the same condition", () => {
    const { sql, values } = where()
      .and("name", "like", "john")
      .and("email", "like", "john@d")
      .build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") LIKE upper(?) AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john%", "%john@d%", 201, 0]);
  });

  test("Test like or conditions", () => {
    const { sql, values } = where()
      .or([
        ["name", "like", "john"],
        ["name", "like", "doe"],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND (upper("name") LIKE upper(?) OR upper("name") LIKE upper(?)) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john%", "%doe%", 201, 0]);
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
      '1 = 1 AND upper("age") LIKE upper(?) AND (upper("name") LIKE upper(?) OR upper("name") LIKE upper(?)) AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%32%", "%john%", "%doe%", "%john@doe%", 201, 0]);
  });

  test("Error on pass array as value", () => {
    expect(() => where().and("age", "like", ["23"]).build()).toThrow(Error);
  });

  test("Error on pass number as value", () => {
    expect(() => where().and("age", "like", 23).build()).toThrow(Error);
  });

  test("Error on pass true as value", () => {
    expect(() => where().and("age", "like", true).build()).toThrow(Error);
  });

  test("Error on pass null as value", () => {
    expect(() => where().and("age", "like", null).build()).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "like", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });
});
