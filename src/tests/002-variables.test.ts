import { Context } from "../context";
import { evaluate, parse } from "../main";
import { Keyword, Token } from "../token";

describe("Local variables", () => {
  test("is able to parse variable definition", () => {
    const actual = parse("(define x 12)");
    const expected = [
      Token.keyword(Keyword.Define),
      Token.identifier("x"),
      Token.literal(12),
    ];

    expect(actual).toEqual(expected);
  });

  test("Can evaluate variable expression", () => {
    const context = Context.StandardLibrary();
    const expected = 6;

    const definition = evaluate(`(define x ${expected})`, context);
    expect(definition).toEqual(undefined);

    const actual = evaluate("x", context);
    expect(actual).toEqual(expected);
  });

  test("Sets local scope and not global", () => {
    const global = Context.StandardLibrary();
    const nestedContext = new Context(
      {},
      new Context({}, new Context({}, global))
    );
    const expected = 6;

    const definition = evaluate(`(define x ${expected})`, nestedContext);
    expect(definition).toEqual(undefined);

    const actual = nestedContext.get("x");
    expect(actual).toEqual(expected);

    expect(() => global.get("x")).toThrowError(
      "Identifier 'x' could not be found."
    );
  });
});

describe("Global Variables", () => {
  test("is able to parse variable definition", () => {
    const actual = parse("(set! x 12)");
    const expected = [
      Token.keyword(Keyword.Set),
      Token.identifier("x"),
      Token.literal(12),
    ];

    expect(actual).toEqual(expected);
  });

  test("Can evaluate variable expression", () => {
    const global = Context.StandardLibrary();
    const nestedContext = new Context(
      {},
      new Context({}, new Context({}, global))
    );

    const expected = 6;

    const definition = evaluate(`(set! x ${expected})`, nestedContext);
    expect(definition).toEqual(undefined);

    const actual = global.get("x");
    expect(actual).toEqual(expected);
  });
});
