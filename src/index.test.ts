import { interpret } from './index';
import { Environment } from './types';

describe('Project', () => {
  test('is operational', () => {
    expect(true).toBe(true);
  });
});

describe('Interpreter', () => {
  test('can do simple expression evaluation', () => {
    expect(interpret('(+ 1 2 3)')).toBe(6);
  });

  test('can do complex expression evaluation', () => {
    const fib = `
(define fib (lambda (n)
    (if (= n 0)
        0
        (if (< n 2) 
            1 
        (+ (fib (- n 1)) (fib (- n 2)))))
    )
)`;

    const env = Environment.CreateGlobal();

    expect(interpret(fib, env)).toEqual([]);
    expect(interpret('(fib 7)', env)).toEqual(13);
    expect(interpret('(fib 10)', env)).toEqual(55);
    expect(interpret('(fib 20)', env)).toEqual(6765);
  });
});
