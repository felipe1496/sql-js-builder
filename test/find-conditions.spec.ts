import { where } from "../src/where";

describe("findConditions", () => {
  it("deve retornar uma condição simples existente (nível AND)", () => {
    const w = where().and("username", "eq", "felipe").and("age", "gt", 18);

    const result = w.findConditions("username");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      field: "username",
      operator: "eq",
      value: "felipe",
    });
  });

  it("não deve retornar condições dentro de OR por padrão", () => {
    const w = where()
      .and("age", "gt", 18)
      .or([
        ["username", "eq", "felipe"],
        ["email", "sw", "felipe@"],
      ]);

    const result = w.findConditions("username");
    expect(result).toHaveLength(0);
  });

  it("deve retornar condições dentro de OR quando includeOrGroups = true", () => {
    const w = where()
      .and("age", "gt", 18)
      .or([
        ["username", "eq", "felipe"],
        ["email", "sw", "felipe@"],
      ]);

    const result = w.findConditions("username", undefined, {
      includeOrGroups: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      field: "username",
      operator: "eq",
      value: "felipe",
    });
  });

  it("deve filtrar também pelo operador quando informado", () => {
    const w = where()
      .and("username", "eq", "felipe")
      .and("username", "sw", "felipe");

    const result = w.findConditions("username", ["sw"]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      operator: "sw",
    });
  });

  it("deve retornar vazio quando o campo não existir", () => {
    const w = where().and("age", "gt", 18).and("country", "eq", "BR");

    const result = w.findConditions("username");
    expect(result).toHaveLength(0);
  });

  it("deve retornar múltiplas condições se houver repetidas (nível AND)", () => {
    const w = where()
      .and("username", "eq", "felipe")
      .and("username", "eq", "joao");

    const result = w.findConditions("username", ["eq"]);
    expect(result).toHaveLength(2);
  });

  it("deve ignorar condições dentro de OR se includeOrGroups = false", () => {
    const w = where()
      .and("status", "eq", "active")
      .or([
        ["username", "eq", "felipe"],
        ["email", "eq", "felipe@gmail.com"],
      ]);

    const result = w.findConditions("username", ["eq"], {
      includeOrGroups: false,
    });
    expect(result).toHaveLength(0);
  });

  it("deve combinar condições AND e OR quando includeOrGroups = true", () => {
    const w = where()
      .and("username", "eq", "felipe")
      .or([
        ["username", "eq", "joao"],
        ["email", "eq", "felipe@gmail.com"],
      ]);

    const result = w.findConditions("username", ["eq"], {
      includeOrGroups: true,
    });

    expect(result).toHaveLength(2);
    const fields = result.map((c: any) => c.value);
    expect(fields).toContain("felipe");
    expect(fields).toContain("joao");
  });
});
