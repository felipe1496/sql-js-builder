import { where } from "../src";

describe("Tests remove functionality", () => {
  test("Should remove a single AND condition", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("age", "eq", 30)
      .remove("age")
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 201, 0]);
  });

  test("Should remove all OR conditions matching remove", () => {
    const { sql, values } = where()
      .or([
        ["status", "eq", "active"],
        ["status", "eq", "pending"],
      ])
      .or([
        ["role", "eq", "admin"],
        ["role", "eq", "user"],
      ])
      .remove("status")
      .build();

    expect(sql).toBe('1 = 1 AND ("role" = ? OR "role" = ?) LIMIT ? OFFSET ?');
    expect(values).toEqual(["admin", "user", 201, 0]);
  });

  test("Should remove multiple filters at once", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("age", "eq", 25)
      .or([
        ["status", "eq", "active"],
        ["role", "eq", "admin"],
      ])
      .remove("age")
      .remove("status")
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? AND ("role" = ?) LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", "admin", 201, 0]);
  });

  test("Should not remove any condition if field does not exist", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .remove("nonexistent")
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 201, 0]);
  });

  test("Should work correctly with replace and remove combined", () => {
    const { sql, values } = where()
      .and("created_at", "eq", "2025-10-10")
      .replace("created_at", "creation_date")
      .remove("created_at")
      .build();

    expect(sql).toBe("1 = 1 LIMIT ? OFFSET ?");
    expect(values).toEqual([201, 0]);
  });

  test("Should work correctly with orderBy and remove", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("age", "eq", 30)
      .orderBy("age", "desc")
      .remove("age")
      .build();

    expect(sql).toBe(
      '1 = 1 AND "name" = ? ORDER BY "age" desc LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", 201, 0]);
  });

  test("Should remove OR group entirely if all fields are removed", () => {
    const { sql, values } = where()
      .or([
        ["status", "eq", "active"],
        ["status", "eq", "pending"],
      ])
      .remove("status")
      .build();

    expect(sql).toBe("1 = 1 LIMIT ? OFFSET ?");
    expect(values).toEqual([201, 0]);
  });
});

describe("remove edge cases", () => {
  test("Removing all fields results in SQL with only 1=1", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("age", "eq", 30)
      .remove("name")
      .remove("age")
      .build();

    expect(sql).toBe("1 = 1 LIMIT ? OFFSET ?");
    expect(values).toEqual([201, 0]);
  });

  test("Removing all OR conditions results in SQL with only 1=1", () => {
    const { sql, values } = where()
      .or([
        ["status", "eq", "active"],
        ["status", "eq", "pending"],
      ])
      .remove("status")
      .build();

    expect(sql).toBe("1 = 1 LIMIT ? OFFSET ?");
    expect(values).toEqual([201, 0]);
  });

  test("Removing all AND and OR conditions combined", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .or([
        ["status", "eq", "active"],
        ["role", "eq", "admin"],
      ])
      .remove("name")
      .remove("status")
      .remove("role")
      .build();

    expect(sql).toBe("1 = 1 LIMIT ? OFFSET ?");
    expect(values).toEqual([201, 0]);
  });
});
