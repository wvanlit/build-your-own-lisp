import { atom, parse, tokenize } from './parser';

describe('Tokenizer', () => {
  test('is operational', () => {
    var tokens = tokenize('(begin (define r 10) (* pi (* r r)))');

    expect(tokens).toEqual([
      '(',
      'begin',
      '(',
      'define',
      'r',
      '10',
      ')',
      '(',
      '*',
      'pi',
      '(',
      '*',
      'r',
      'r',
      ')',
      ')',
      ')',
    ]);
  });
});

describe('Atom', () => {
  test('should parse numbers to Atom', () => {
    const tests: [string, number][] = [
      ['1', 1],
      ['42', 42],
      ['-1', -1],
      ['1.1', 1.1],
      ['222.222', 222.222],
      ['-1222.222', -1222.222],
    ];

    for (const [input, expected] of tests) {
      expect(atom(input)).toEqual(expected);
    }
  });

  test('should parse string to Atom', () => {
    const tests: string[] = [
      '+',
      '-',
      'var',
      'let',
      'define',
      'if',
      'eq',
      'list?',
      '👀',
    ];

    for (const input of tests) {
      expect(atom(input)).toEqual(input);
    }
  });
});

describe('Parser', () => {
  test('should parse simple expression', () => {
    const actual = parse('(+ 1 2 3)');
    expect(actual).toEqual(['+', 1, 2, 3]);
  });

  test('should parse nested expressions ', () => {
    const actual = parse('(define square (lambda (x) (* x x)))');
    expect(actual).toEqual([
      'define',
      'square',
      ['lambda', ['x'], ['*', 'x', 'x']],
    ]);
  });
});
