import { interpret, parse, scan, tokenize } from "../main";
import { Token } from "../token";

describe("Scan", () => {
  test("Can scan expression string into a scanned list", () => {
    const given = "(+ 1 2)";
    const expected = ["(", "+", "1", "2", ")"];
    const actual = scan(given);

    expect(actual).toEqual(expected);
  });

  test("Can scan nested expression string into a scanned list", () => {
    const given = "(+ 1 (- 1 1))";
    const expected = ["(", "+", "1", "(", "-", "1", "1", ")", ")"];
    const actual = scan(given);

    expect(actual).toEqual(expected);
  });

  test("Can scan multiple expressions", () => {
    const given = "(+ 1 1) (* 1 2)";
    const expected = ["(", "+", "1", "1", ")", "(", "*", "1", "2", ")"];
    const actual = scan(given);
    expect(actual).toEqual(expected);
  });
});

describe("Tokenize", () => {
  test("Can tokenize scanned code into an AST", () => {
    const given = ["(", "+", "1", "1", "1", ")"];
    const expected = [
      Token.identifier("+"),
      Token.literal(1),
      Token.literal(1),
      Token.literal(1),
    ];
    const actual = tokenize(given);

    expect(actual).toEqual(expected);
  });

  test("Can tokenize nested expressions", () => {
    const given = ["(", "+", "1", "(", "-", "1", "1", ")", ")"];
    const expected = [
      Token.identifier("+"),
      Token.literal(1),
      [Token.identifier("-"), Token.literal(1), Token.literal(1)],
    ];
    const actual = tokenize(given);

    expect(actual).toEqual(expected);
  });

  test("Can evaluate multiple expressions", () => {
    const given = scan("((+ 1 1) (* 1 2))");
    const expected = [
      [Token.identifier("+"), Token.literal(1), Token.literal(1)],
      [Token.identifier("*"), Token.literal(1), Token.literal(2)],
    ];
    const actual = tokenize(given);
    expect(actual).toEqual(expected);
  });
});

describe("Interpret", () => {
  test("Can evaluate simple calculator expression", () => {
    const given = parse("(+ 1 2 3)");
    const expected = 6;
    const actual = interpret(given);
    expect(actual).toEqual(expected);
  });

  test("Can evaluate nested calculator expression", () => {
    const given = parse("(+ 6 (+ 1 2 3) (- 10 4))");
    const expected = 18;
    const actual = interpret(given);
    expect(actual).toEqual(expected);
  });

  test("Can evaluate standard mathematical operations", () => {
    const given = parse("(/ (- 20 12) (+ 1 1) (* 1 2))");
    const expected = 2;
    const actual = interpret(given);
    expect(actual).toEqual(expected);
  });

  test("Can evaluate multiple expressions", () => {
    const given = parse("((+ 1 1) (* 1 2))");
    const expected = [2, 2];
    const actual = interpret(given);
    expect(actual).toEqual(expected);
  });
});
