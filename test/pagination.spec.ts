import { where } from "../src";

describe("Tests pagination (page and perPage)", () => {
  test("Default pagination (no page and perPage called)", () => {
    const { sql, values } = where().and("name", "eq", "john").build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 201, 0]);
  });

  test("Custom perPage only", () => {
    const { sql, values } = where().limit(50).and("name", "eq", "john").build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual(["john", 50, 0]);
  });

  test("Custom page only", () => {
    const { sql, values } = where()
      .limit(201)
      .offset(402)
      .and("name", "eq", "john")
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');

    expect(values).toEqual(["john", 201, 402]);
  });

  test("Custom page and perPage", () => {
    const { sql, values } = where()
      .limit(10)
      .offset(10)
      .and("name", "eq", "john")
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');

    expect(values).toEqual(["john", 10, 10]);
  });

  test("Page 1 with custom perPage", () => {
    const { sql, values } = where().limit(25).and("age", "eq", 30).build();

    expect(sql).toBe('1 = 1 AND "age" = ? LIMIT ? OFFSET ?');
    expect(values).toEqual([30, 25, 0]);
  });

  test("Multiple where with pagination", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("email", "eq", "john@doe.com")
      .limit(15)
      .offset(45)
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? AND "email" = ? LIMIT ? OFFSET ?');

    expect(values).toEqual(["john", "john@doe.com", 15, 45]);
  });

  test("a", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("email", "eq", "john@doe.com")
      .limit(1)
      .offset(1)
      .build();

    expect(sql).toBe('1 = 1 AND "name" = ? AND "email" = ? LIMIT ? OFFSET ?');

    expect(values).toEqual(["john", "john@doe.com", 1, 1]);
  });

  test("Throws error if page is invalid (zero or negative)", () => {
    expect(() => where().limit(-2).build()).toThrow(Error);
  });

  test("Throws error if perPage is invalid (zero or negative)", () => {
    expect(() => where().offset(-10).build()).toThrow(Error);
  });
});
