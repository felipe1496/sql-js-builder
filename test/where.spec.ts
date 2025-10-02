import { where } from "../src";

describe("Tests where", () => {
  describe("Cenários básicos da função where", () => {
    test("Sem condições", () => {
      const { sql, values } = where().build();

      expect(sql).toBe("1 = 1 LIMIT ? OFFSET ?");
      expect(values).toEqual([201, 0]);
    });

    test("Com uma condição simples", () => {
      const { sql, values } = where().and("name", "eq", "john").build();

      expect(sql).toBe('1 = 1 AND "name" = ? LIMIT ? OFFSET ?');
      expect(values).toEqual(["john", 201, 0]);
    });

    test("Com múltiplas condições AND", () => {
      const { sql, values } = where()
        .and("name", "eq", "john")
        .and("age", "gte", 25)
        .and("email", "like", "john@")
        .build();

      expect(sql).toBe(
        '1 = 1 AND "name" = ? AND "age" >= ? AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
      );
      expect(values).toEqual(["john", 25, "%john@%", 201, 0]);
    });
  });

  describe("Combinações de operadores diferentes", () => {
    test("Mistura de diferentes tipos de operadores", () => {
      const { sql, values } = where()
        .and("status", "eq", "active")
        .and("age", "gte", 18)
        .and("category", "in", ["tech", "books"])
        .and("title", "like", "javascript")
        .and("is_featured", "is", true)
        .build();

      expect(sql).toBe(
        '1 = 1 AND "status" = ? AND "age" >= ? AND "category" IN (?, ?) AND upper("title") LIKE upper(?) AND "is_featured" IS ? LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([
        "active",
        18,
        "tech",
        "books",
        "%javascript%",
        true,
        201,
        0,
      ]);
    });

    test("Combinação de operadores de comparação e string", () => {
      const { sql, values } = where()
        .and("price", "gte", 10)
        .and("price", "lte", 100)
        .and("name", "sw", "admin")
        .and("email", "ew", "@gmail.com")
        .build();

      expect(sql).toBe(
        '1 = 1 AND "price" >= ? AND "price" <= ? AND upper("name") LIKE upper(?) AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([10, 100, "admin%", "%@gmail.com", 201, 0]);
    });
  });

  describe("Condições OR", () => {
    test("Condições OR simples", () => {
      const { sql, values } = where()
        .or([
          ["status", "eq", "active"],
          ["status", "eq", "pending"],
        ])
        .build();
      expect(sql).toBe(
        '1 = 1 AND ("status" = ? OR "status" = ?) LIMIT ? OFFSET ?'
      );
      expect(values).toEqual(["active", "pending", 201, 0]);
    });

    test("Múltiplas condições OR", () => {
      const { sql, values } = where()
        .or([
          ["category", "eq", "tech"],
          ["category", "eq", "science"],
          ["category", "eq", "engineering"],
        ])
        .build();
      expect(sql).toBe(
        '1 = 1 AND ("category" = ? OR "category" = ? OR "category" = ?) LIMIT ? OFFSET ?'
      );
      expect(values).toEqual(["tech", "science", "engineering", 201, 0]);
    });

    test("OR com diferentes operadores", () => {
      const { sql, values } = where()
        .or([
          ["age", "gte", 18],
          ["role", "eq", "admin"],
          ["is_verified", "is", true],
        ])
        .build();
      expect(sql).toBe(
        '1 = 1 AND ("age" >= ? OR "role" = ? OR "is_verified" IS ?) LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([18, "admin", true, 201, 0]);
    });
  });

  describe("Combinações complexas AND/OR", () => {
    test("AND e OR misturados", () => {
      const { sql, values } = where()
        .and("is_active", "is", true)
        .or([
          ["role", "eq", "admin"],
          ["role", "eq", "moderator"],
        ])
        .and("age", "gte", 18)
        .build();
      expect(sql).toBe(
        '1 = 1 AND "is_active" IS ? AND ("role" = ? OR "role" = ?) AND "age" >= ? LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([true, "admin", "moderator", 18, 201, 0]);
    });

    test("Múltiplos ORs", () => {
      const { sql, values } = where()
        .or([
          ["status", "eq", "active"],
          ["status", "eq", "pending"],
        ])
        .or([
          ["category", "in", ["tech", "science"]],
          ["priority", "gte", 8],
        ])
        .build();
      expect(sql).toBe(
        '1 = 1 AND ("status" = ? OR "status" = ?) AND ("category" IN (?, ?) OR "priority" >= ?) LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([
        "active",
        "pending",
        "tech",
        "science",
        8,
        201,
        0,
      ]);
    });

    test("Condições complexas com diferentes tipos", () => {
      const { sql, values } = where()
        .and("created_at", "gte", "2023-01-01")
        .or([
          ["status", "eq", "published"],
          ["is_featured", "is", true],
        ])
        .and("category", "in", ["blog", "article", "news"])
        .and("title", "like", "javascript")
        .or([
          ["author_id", "eq", 1],
          ["author_id", "eq", 2],
        ])
        .build();
      expect(sql).toBe(
        '1 = 1 AND "created_at" >= ? AND ("status" = ? OR "is_featured" IS ?) AND "category" IN (?, ?, ?) AND upper("title") LIKE upper(?) AND ("author_id" = ? OR "author_id" = ?) LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([
        "2023-01-01",
        "published",
        true,
        "blog",
        "article",
        "news",
        "%javascript%",
        1,
        2,
        201,
        0,
      ]);
    });
  });

  describe("Cenários reais de uso", () => {
    test("Busca de usuários", () => {
      const { sql, values } = where()
        .and("is_active", "is", true)
        .and("age", "gte", 18)
        .or([
          ["role", "eq", "admin"],
          ["role", "eq", "moderator"],
        ])
        .and("email", "like", "@gmail.com")
        .build();

      expect(sql).toBe(
        '1 = 1 AND "is_active" IS ? AND "age" >= ? AND ("role" = ? OR "role" = ?) AND upper("email") LIKE upper(?) LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([
        true,
        18,
        "admin",
        "moderator",
        "%@gmail.com%",
        201,
        0,
      ]);
    });

    test("Filtro de produtos", () => {
      const { sql, values } = where()
        .and("price", "gte", 10)
        .and("price", "lte", 100)
        .and("category", "in", ["electronics", "books"])
        .or([
          ["is_featured", "is", true],
          ["rating", "gte", 4.5],
        ])
        .and("stock", "gt", 0)
        .build();

      expect(sql).toBe(
        '1 = 1 AND "price" >= ? AND "price" <= ? AND "category" IN (?, ?) AND ("is_featured" IS ? OR "rating" >= ?) AND "stock" > ? LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([
        10,
        100,
        "electronics",
        "books",
        true,
        4.5,
        0,
        201,
        0,
      ]);
    });

    test("Busca de artigos", () => {
      const { sql, values } = where()
        .and("status", "eq", "published")
        .and("published_at", "gte", "2023-01-01")
        .or([
          ["title", "like", "javascript"],
          ["content", "like", "typescript"],
        ])
        .and("author_id", "in", [1, 2, 3, 4, 5])
        .and("is_deleted", "is", false)
        .build();

      expect(sql).toBe(
        '1 = 1 AND "status" = ? AND "published_at" >= ? AND (upper("title") LIKE upper(?) OR upper("content") LIKE upper(?)) AND "author_id" IN (?, ?, ?, ?, ?) AND "is_deleted" IS ? LIMIT ? OFFSET ?'
      );
      expect(values).toEqual([
        "published",
        "2023-01-01",
        "%javascript%",
        "%typescript%",
        1,
        2,
        3,
        4,
        5,
        false,
        201,
        0,
      ]);
    });
  });

  describe("Performance e stress", () => {
    test("Muitas condições AND", () => {
      const query = where();
      const expectedValues: any[] = [];

      for (let i = 1; i <= 10; i++) {
        query.and(`field_${i}`, "eq", `value_${i}`);
        expectedValues.push(`value_${i}`);
      }

      const { sql, values } = query.build();
      expect(values).toEqual([...expectedValues, 201, 0]);
      expect(sql).toContain("1 = 1 AND");
      expect(sql.split("AND").length).toBe(11);
    });

    test("Muitas condições OR", () => {
      const orConditions: [string, any, any][] = [];
      const expectedValues: any[] = [];

      for (let i = 1; i <= 5; i++) {
        orConditions.push([`field_${i}`, "eq", `value_${i}`]);
        expectedValues.push(`value_${i}`);
      }

      const { sql, values } = where().or(orConditions).build();
      expect(values).toEqual([...expectedValues, 201, 0]);
      expect(sql).toContain("OR");
      expect(sql.split("OR").length).toBe(5);
    });
  });

  describe("Validações específicas da função where", () => {
    test("Operador inválido", () => {
      expect(() => {
        where()
          .and("name", "invalid_operator" as any, "value")
          .build();
      }).toThrow(Error);
    });

    test("Valor inválido para operador in", () => {
      expect(() => {
        where().and("category", "in", "not_an_array").build();
      }).toThrow(Error);
    });

    test("Valor inválido para operador like", () => {
      expect(() => {
        where().and("name", "like", 123).build();
      }).toThrow(Error);
    });

    test("Valor inválido para operador is", () => {
      expect(() => {
        where().and("flag", "is", "not_boolean").build();
      }).toThrow(Error);
    });

    test("Valor inválido para operador eq", () => {
      expect(() => {
        where().and("field", "eq", { object: "not_allowed" }).build();
      }).toThrow(Error);
    });

    test("Tests where from str value", () => {
      const { sql, values } = where("name eq 'john' and age gte 25").build();

      expect(sql).toBe('1 = 1 AND "name" = ? AND "age" >= ? LIMIT ? OFFSET ?');
      expect(values).toEqual(["john", 25, 201, 0]);
    });
  });
});
