import { where } from "../src";

describe("Tests nlike operator", () => {
  test("Regular nlike value", () => {
    const { sql, values } = where().and("name", "nlike", "john").build();

    expect(sql).toBe(
      `1 = 1 AND upper("name") NOT LIKE upper(?) LIMIT ? OFFSET ?`
    );
    expect(values).toEqual(["%john%", 201, 0]);
  });

  test("Multiple nlike condition on the same condition", () => {
    const { sql, values } = where()
      .and("name", "nlike", "john")
      .and("email", "nlike", "john@d")
      .build();

    expect(sql).toBe(
      '1 = 1 AND upper("name") NOT LIKE upper(?) AND upper("email") NOT LIKE upper(?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john%", "%john@d%", 201, 0]);
  });

  test("Test nlike or conditions", () => {
    const { sql, values } = where()
      .or([
        ["name", "nlike", "john"],
        ["name", "nlike", "doe"],
      ])
      .build();
    expect(sql).toBe(
      '1 = 1 AND (upper("name") NOT LIKE upper(?) OR upper("name") NOT LIKE upper(?)) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%john%", "%doe%", 201, 0]);
  });

  test("Tests or and and eq conditions on the same search", () => {
    const { sql, values } = where()
      .and("age", "nlike", "32")
      .or([
        ["name", "nlike", "john"],
        ["name", "nlike", "doe"],
      ])
      .and("email", "nlike", "john@doe")
      .build();
    expect(sql).toBe(
      '1 = 1 AND upper("age") NOT LIKE upper(?) AND (upper("name") NOT LIKE upper(?) OR upper("name") NOT LIKE upper(?)) AND upper("email") NOT LIKE upper(?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["%32%", "%john%", "%doe%", "%john@doe%", 201, 0]);
  });

  test("Error on pass array as value", () => {
    expect(() => where().and("age", "nlike", ["23"]).build()).toThrow(Error);
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
