import { TAtom, TExpression, TList, TSymbol } from './types';

export function parse(program: string): any {
  const tokens = tokenize(program);
  return readTokens(tokens);
}

export function tokenize(chars: string) {
  return chars
    .replaceAll('(', ' ( ')
    .replaceAll(')', ' ) ')
    .split(' ')
    .filter((s) => s !== '');
}

export function readTokens(tokens: string[]): TExpression {
  const token = tokens.shift();
  if (token === undefined) throw new SyntaxError('Unexpected EOF');

  if (token === '(') {
    const list: TList = [];

    while (tokens[0] !== ')') {
      list.push(readTokens(tokens));
    }

    tokens.shift(); // Pop remaining )

    return list;
  } else if (token === ')') {
    throw new SyntaxError("Unexpected ')'");
  } else {
    return atom(token);
  }
}

export function atom(token: string): TAtom {
  const num = TryParseNumber(token);
  if (num !== undefined) return num;
  return token as TSymbol;
}

function TryParseNumber(token: string) {
  const num = Number.parseFloat(token);
  return isNaN(num) ? undefined : num;
}
