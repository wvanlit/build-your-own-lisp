import { Context } from "../context";
import { evaluate, parse } from "../main";
import { Keyword, Token } from "../token";

describe("Functions", () => {
  test("Can parse lambda correctly", () => {
    const code = `(define add (lambda (x y) + x y 1))`;
    const actual = parse(code);
    const expected = [
      Token.keyword(Keyword.Define),
      Token.identifier("add"),
      [
        Token.keyword(Keyword.Lambda),
        [Token.identifier("x"), Token.identifier("y")], // Arguments are in separate list
        Token.identifier("+"),
        Token.identifier("x"),
        Token.identifier("y"),
        Token.literal(1),
      ],
    ];

    expect(actual).toEqual(expected);
  });

  test("Can evaluate lambda", () => {
    const context = Context.StandardLibrary();

    const definition = evaluate(`(define add (lambda (x y) + x y))`, context);
    expect(definition).toEqual(undefined);

    const actual = evaluate("(add 1 2)", context);
    expect(actual).toEqual(3);

    const actual2 = evaluate("(add 9 11)", context);
    expect(actual2).toEqual(20);
  });

  test("Can evaluate lambda with lambda return value", () => {
    const context = Context.StandardLibrary();

    evaluate(`(define add (lambda (x) lambda (y) + x y))`, context);
    evaluate(`(define add1 (add 1))`, context);
    evaluate(`(define add5 (add 5))`, context);

    const actual = evaluate("(add1 2)", context);
    expect(actual).toEqual(3);

    const actual2 = evaluate("(add1 20)", context);
    expect(actual2).toEqual(21);

    const actual3 = evaluate("(add5 7)", context);
    expect(actual3).toEqual(12);
  });
});
