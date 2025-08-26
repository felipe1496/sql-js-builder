import { where } from "../src";

describe("Tests is operator", () => {
  test("Regular is value", () => {
    const { sql, values } = where().and("has_profile", "is", false).build();

    expect(sql).toBe('1 = 1 AND "has_profile" IS ?');
    expect(values).toEqual([false]);
  });

  test("Multiple is condition on the same condition", () => {
    const { sql, values } = where()
      .and("has_profile", "is", false)
      .and("google_account", "is", true)
      .and("password", "is", null)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "has_profile" IS ? AND "google_account" IS ? AND "password" IS ?'
    );
    expect(values).toEqual([false, true, null]);
  });

  test("Test is or conditions", () => {
    const { sql, values } = where()
      .or([
        ["birth_date", "is", null],
        ["has_profile", "is", false],
      ])
      .build();
    expect(sql).toBe('1 = 1 AND ("birth_date" IS ? OR "has_profile" IS ?)');
    expect(values).toEqual([null, false]);
  });

  test("Tests or and and eq conditions on the same search", () => {
    const { sql, values } = where()
      .and("age", "is", null)
      .or([
        ["has_profile", "is", true],
        ["has_password", "is", false],
      ])
      .and("nickname", "is", null)
      .build();
    expect(sql).toBe(
      '1 = 1 AND "age" IS ? AND ("has_profile" IS ? OR "has_password" IS ?) AND "nickname" IS ?'
    );
    expect(values).toEqual([null, true, false, null]);
  });

  test("Error on pass array as value", () => {
    expect(() => where().and("age", "is", ["23"]).build()).toThrow(Error);
  });

  test("Error on pass string as value", () => {
    expect(() => where().and("age", "is", "true").build()).toThrow(Error);
  });

  test("Error on pass number as value", () => {
    expect(() => where().and("age", "is", 2).build()).toThrow(Error);
  });

  test("Error on pass object as value", () => {
    expect(() =>
      where()
        .and("age", "is", {
          some: "value",
        })
        .build()
    ).toThrow(Error);
  });
});
