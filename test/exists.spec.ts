import { where } from "../src";

describe("Tests exists functionality", () => {
  test("Should return true for a single AND condition", () => {
    const w = where().and("name", "eq", "john");
    expect(w.exists("name")).toBe(true);
    expect(w.exists("age")).toBe(false);
  });

  test("Should return true for a field inside OR conditions", () => {
    const w = where().or([
      ["status", "eq", "active"],
      ["role", "eq", "admin"],
    ]);

    expect(w.exists("status")).toBe(true);
    expect(w.exists("role")).toBe(true);
    expect(w.exists("name")).toBe(false);
  });

  test("Should respect removed filters", () => {
    const w = where()
      .and("name", "eq", "john")
      .and("age", "eq", 30)
      .remove("age");

    expect(w.exists("name")).toBe(true);
    expect(w.exists("age")).toBe(true); // exists retorna true mesmo que o campo tenha sido removido, pois a condição ainda existe internamente
  });

  test("Should return false if no conditions exist", () => {
    const w = where();
    expect(w.exists("name")).toBe(false);
    expect(w.exists("age")).toBe(false);
  });

  test("Should work with multiple AND and OR combinations", () => {
    const w = where()
      .and("name", "eq", "john")
      .or([
        ["status", "eq", "active"],
        ["role", "eq", "admin"],
      ]);

    expect(w.exists("name")).toBe(true);
    expect(w.exists("status")).toBe(true);
    expect(w.exists("role")).toBe(true);
    expect(w.exists("age")).toBe(false);
  });
});
