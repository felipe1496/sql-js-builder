import { where } from "../src";

describe("Tests ew operator", () => {
  test("Regular ew value", () => {
    const { sql, values } = where().and("name", "ew", "john").build();

    expect(sql).toBe(`1 = 1 AND upper("name") LIKE upper(?) LIMIT ? OFFSET ?`);
    expect(values).toEqual(["%john", 200, 0]);
  });

  test("Multiple ew condition on the same condition", () => {
    const { sql, values } = where()
      .and("name", "ew", "john")
      .and("email", "ew", "john@d")
      .build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") LIKE upper(?) AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john", "%john@d", 200, 0]);
  });

  test("Test ew or conditions", () => {
    const { sql, values } = where()
      .or([
        ["name", "ew", "john"],
        ["name", "ew", "doe"],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND (upper("name") LIKE upper(?) OR upper("name") LIKE upper(?)) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john", "%doe", 200, 0]);
  });

  test("Tests or and and eq conditions on the same search", () => {
    const { sql, values } = where()
      .and("age", "ew", "32")
      .or([
        ["name", "ew", "john"],
        ["name", "ew", "doe"],
      ])
      .and("email", "ew", "john@doe")
      .build();
    expect(sql).toBe(
      '1 = 1 AND upper("age") LIKE upper(?) AND (upper("name") LIKE upper(?) OR upper("name") LIKE upper(?)) AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%32", "%john", "%doe", "%john@doe", 200, 0]);
  });

  test("Error on pass array as value", () => {
    expect(() => where().and("age", "ew", ["23"]).build()).toThrow(Error);
  });

  test("Error on pass number as value", () => {
    expect(() => where().and("age", "ew", 23).build()).toThrow(Error);
  });

  test("Error on pass true as value", () => {
    expect(() => where().and("age", "ew", true).build()).toThrow(Error);
  });

  test("Error on pass null as value", () => {
    expect(() => where().and("age", "ew", null).build()).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "ew", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });
});
