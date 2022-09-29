import { evaluate } from './interpreter';
import { parse } from './parser';
import { Environment } from './types';

const run = (code: string, env = Environment.CreateGlobal()) =>
  evaluate(parse(code), env);

describe('Interpreter', () => {
  test('should evaluate simple expression', () => {
    expect(run('(+ 1 2 3)')).toEqual(6);
  });

  test('should evaluate variable', () => {
    const env = Environment.CreateGlobal();
    expect(run('(define x 9)', env)).toEqual([]);
    expect(run('(define y 11)', env)).toEqual([]);
    expect(run('(* x y)', env)).toEqual(99);
  });

  test('should evaluate if statment', () => {
    expect(run('(if #t 1 2)')).toEqual(1);
    expect(run('(if #f 1 2)')).toEqual(2);
  });

  test('should evaluate empty list to empty list', () => {
    expect(run('()')).toEqual([]);
  });

  test('should evaluate type equality', () => {
    expect(run('(number? 2)')).toEqual(true);
    expect(run('(number? #t)')).toEqual(false);

    expect(run('(list? (list 1 2))')).toEqual(true);
    expect(run('(list? #t)')).toEqual(false);

    expect(run('(bool? #t)')).toEqual(true);
    expect(run('(bool? 2)')).toEqual(false);
  });

  test('should evaluate lambda expressions', () => {
    const env = Environment.CreateGlobal();
    expect(run('(define square (lambda (x) (* x x)))', env)).toEqual([]);
    expect(run('(square 9)', env)).toEqual(9);
  });
});
