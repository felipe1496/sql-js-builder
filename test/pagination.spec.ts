import { where } from "../src";

describe("Tests pagination (page and perPage)", () => {
  test("Default pagination (no page and perPage called)", () => {
    const { sql, values } = where().and("name", "eq", "john").build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 200, 0]); // default: perPage = 200, page = 1
  });

  test("Custom perPage only", () => {
    const { sql, values } = where()
      .perPage(50)
      .and("name", "eq", "john")
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 50, 0]);
  });

  test("Custom page only", () => {
    const { sql, values } = where().page(3).and("name", "eq", "john").build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    // page 3, perPage default 200 -> offset = (3 - 1) * 200 = 400
    expect(values).toEqual(["john", 200, 400]);
  });

  test("Custom page and perPage", () => {
    const { sql, values } = where()
      .page(2)
      .perPage(10)
      .and("name", "eq", "john")
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    // page 2, perPage 10 -> offset = (2 - 1) * 10 = 10
    expect(values).toEqual(["john", 10, 10]);
  });

  test("Page 1 with custom perPage", () => {
    const { sql, values } = where()
      .page(1)
      .perPage(25)
      .and("age", "eq", 30)
      .build();

    expect(sql).toBe('1 = 1 AND "age" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual([30, 25, 0]);
  });

  test("Multiple where with pagination", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("email", "eq", "john@doe.com")
      .page(4)
      .perPage(15)
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? AND "email" = ? LIMIT ? OFFSET ?');
    // page 4, perPage 15 -> offset = (4 - 1) * 15 = 45
    expect(values).toEqual(["john", "john@doe.com", 15, 45]);
  });

  test("Throws error if page is invalid (zero or negative)", () => {
    expect(() => where().page(0).build()).toThrow(Error);
    expect(() => where().page(-2).build()).toThrow(Error);
  });

  test("Throws error if perPage is invalid (zero or negative)", () => {
    expect(() => where().perPage(0).build()).toThrow(Error);
    expect(() => where().perPage(-10).build()).toThrow(Error);
  });
});
