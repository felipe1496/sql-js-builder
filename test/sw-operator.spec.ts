import { where } from "../src";

describe("Tests sw operator", () => {
  test("Regular sw value", () => {
    const { sql, values } = where().and("name", "sw", "john").build();

    expect(sql).toBe(`1 = 1 AND upper("name") LIKE upper(?) LIMIT ? OFFSET ?`);
    expect(values).toEqual(["john%", 201, 0]);
  });

  test("Multiple sw condition on the same condition", () => {
    const { sql, values } = where()
      .and("name", "sw", "john")
      .and("email", "sw", "john@d")
      .build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") LIKE upper(?) AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john%", "john@d%", 201, 0]);
  });

  test("Test sw or conditions", () => {
    const { sql, values } = where()
      .or([
        ["name", "sw", "john"],
        ["name", "sw", "doe"],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND (upper("name") LIKE upper(?) OR upper("name") LIKE upper(?)) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john%", "doe%", 201, 0]);
  });

  test("Tests or and and eq conditions on the same search", () => {
    const { sql, values } = where()
      .and("age", "sw", "32")
      .or([
        ["name", "sw", "john"],
        ["name", "sw", "doe"],
      ])
      .and("email", "sw", "john@doe")
      .build();
    expect(sql).toBe(
      '1 = 1 AND upper("age") LIKE upper(?) AND (upper("name") LIKE upper(?) OR upper("name") LIKE upper(?)) AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["32%", "john%", "doe%", "john@doe%", 201, 0]);
  });

  test("Error on pass array as value", () => {
    expect(() => where().and("age", "sw", ["23"]).build()).toThrow(Error);
  });

  test("Error on pass number as value", () => {
    expect(() => where().and("age", "sw", 23).build()).toThrow(Error);
  });

  test("Error on pass true as value", () => {
    expect(() => where().and("age", "sw", true).build()).toThrow(Error);
  });

  test("Error on pass null as value", () => {
    expect(() => where().and("age", "sw", null).build()).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "sw", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });
});
