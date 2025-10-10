import { where } from "../src";

describe("Tests replaceField functionality", () => {
  test("Should replace a single field in an AND condition", () => {
    const { sql, values } = where()
      .replaceField("name", "user_name")
      .and("name", "eq", "john")
      .build();

    expect(sql).toBe('1 = 1 AND "user_name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 201, 0]);
  });

  test("Should replace multiple fields in different AND conditions", () => {
    const { sql, values } = where()
      .replaceField("name", "user_name")
      .replaceField("email", "user_email")
      .and("name", "eq", "john")
      .and("email", "eq", "john@doe.com")
      .and("age", "eq", 25)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "user_name" = ? AND "user_email" = ? AND "age" = ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", "john@doe.com", 25, 201, 0]);
  });

  test("Should replace field names inside OR conditions", () => {
    const { sql, values } = where()
      .replaceField("name", "full_name")
      .or([
        ["name", "eq", "john"],
        ["name", "eq", "doe"],
      ])
      .build();

    expect(sql).toBe(
      '1 = 1 AND ("full_name" = ? OR "full_name" = ?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", "doe", 201, 0]);
  });

  test("Should replace some fields and keep others untouched", () => {
    const { sql, values } = where()
      .replaceField("email", "contact_email")
      .and("name", "eq", "john")
      .and("email", "eq", "john@doe.com")
      .build();

    expect(sql).toBe(
      '1 = 1 AND "name" = ? AND "contact_email" = ? LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", "john@doe.com", 201, 0]);
  });

  test("Should work when replaceField is called after and/or conditions", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .replaceField("name", "user_name")
      .build();

    expect(sql).toBe('1 = 1 AND "user_name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 201, 0]);
  });

  test("Should handle multiple replaceField calls on the same key (latest wins)", () => {
    const { sql, values } = where()
      .replaceField("name", "user_name")
      .replaceField("name", "profile_name")
      .and("name", "eq", "john")
      .build();

    expect(sql).toBe('1 = 1 AND "profile_name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 201, 0]);
  });

  test("Should apply replaceField in both AND and OR combined conditions", () => {
    const { sql, values } = where()
      .replaceField("name", "full_name")
      .replaceField("email", "user_email")
      .and("email", "eq", "john@doe.com")
      .or([
        ["name", "eq", "john"],
        ["name", "eq", "doe"],
      ])
      .build();

    expect(sql).toBe(
      '1 = 1 AND "user_email" = ? AND ("full_name" = ? OR "full_name" = ?) LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john@doe.com", "john", "doe", 201, 0]);
  });

  test("Should ignore replaceField when field is not used in any condition", () => {
    const { sql, values } = where()
      .replaceField("unused_field", "new_unused_field")
      .and("name", "eq", "john")
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 201, 0]);
  });
});
