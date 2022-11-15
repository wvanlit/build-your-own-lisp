import { Context } from "../context";
import { evaluate } from "../main";

describe("Complete Interpreter", () => {
  test("Can do factorial", () => {
    const context = Context.StandardLibrary();
    evaluate(
      "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))",
      context
    );

    expect(evaluate("(fact 1)", context)).toBe(1);
    expect(evaluate("(fact 5)", context)).toBe(120);
    expect(evaluate("(fact 15)", context)).toBe(1307674368000);
  });

  test("Can do fibonaci", () => {
    const context = Context.StandardLibrary();
    evaluate(
      "(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))",
      context
    );

    expect(evaluate("(fib 5)", context)).toBe(8);
    expect(evaluate("(fib 15)", context)).toBe(987);
    expect(evaluate("(fib 25)", context)).toBe(121393);
  });
});
