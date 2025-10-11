import { where } from "../src";

describe("Tests orderBy functionality", () => {
  test("Should apply single ascending orderBy correctly", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .orderBy("name", "asc")
      .build();

    expect(sql).toBe(
      '1 = 1 AND "name" = ? ORDER BY "name" asc LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", 201, 0]);
  });

  test("Should apply single descending orderBy correctly", () => {
    const { sql, values } = where()
      .and("age", "eq", 25)
      .orderBy("age", "desc")
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" = ? ORDER BY "age" desc LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([25, 201, 0]);
  });

  test("Should apply multiple orderBy fields in order of definition", () => {
    const { sql, values } = where()
      .and("active", "eq", 1)
      .orderBy("name", "asc")
      .orderBy("created_at", "desc")
      .build();

    expect(sql).toBe(
      '1 = 1 AND "active" = ? ORDER BY "name" asc, "created_at" desc LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([1, 201, 0]);
  });

  test("Should include orderBy even if there are no conditions", () => {
    const { sql, values } = where().orderBy("created_at", "desc").build();

    expect(sql).toBe('1 = 1 ORDER BY "created_at" desc LIMIT ? OFFSET ?');
    expect(values).toEqual([201, 0]);
  });

  test("Should work correctly with or conditions", () => {
    const { sql, values } = where()
      .or([
        ["name", "eq", "john"],
        ["name", "eq", "doe"],
      ])
      .orderBy("age", "asc")
      .build();

    expect(sql).toBe(
      '1 = 1 AND ("name" = ? OR "name" = ?) ORDER BY "age" asc LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", "doe", 201, 0]);
  });

  test("Should apply replace before orderBy rendering", () => {
    const { sql, values } = where()
      .replace("created_at", "creation_date")
      .orderBy("created_at", "desc")
      .build();

    // orderBy não deve ser afetado, pois replace afeta apenas condições,
    // não campos estáticos do ORDER BY
    expect(sql).toBe('1 = 1 ORDER BY "created_at" desc LIMIT ? OFFSET ?');
    expect(values).toEqual([201, 0]);
  });

  test("Should handle orderBy when called before and/limit/offset", () => {
    const { sql, values } = where()
      .orderBy("score", "desc")
      .and("age", "eq", 30)
      .limit(5)
      .offset(10)
      .build();

    expect(sql).toBe(
      '1 = 1 AND "age" = ? ORDER BY "score" desc LIMIT ? OFFSET ?'
    );
    expect(values).toEqual([30, 5, 10]);
  });

  test("Should override previous orderBy when same field is passed again", () => {
    const { sql, values } = where()
      .orderBy("name", "asc")
      .orderBy("name", "desc") // deve sobrescrever o anterior
      .build();

    expect(sql).toBe('1 = 1 ORDER BY "name" desc LIMIT ? OFFSET ?');
    expect(values).toEqual([201, 0]);
  });

  test("Should combine orderBy with multiple conditions", () => {
    const { sql, values } = where()
      .and("name", "eq", "john")
      .and("email", "eq", "john@doe.com")
      .orderBy("age", "desc")
      .orderBy("created_at", "asc")
      .build();

    expect(sql).toBe(
      '1 = 1 AND "name" = ? AND "email" = ? ORDER BY "age" desc, "created_at" asc LIMIT ? OFFSET ?'
    );
    expect(values).toEqual(["john", "john@doe.com", 201, 0]);
  });
});
