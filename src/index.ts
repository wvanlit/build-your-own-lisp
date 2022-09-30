import { evaluate } from './interpreter';
import { parse } from './parser';
import { Environment } from './types';

export const version = '0.1.0';

export function interpret(
  input: string,
  env: Environment = Environment.CreateGlobal()
): any {
  return evaluate(parse(input), env);
}

export function interpretFile(input: string) {
  const env = Environment.CreateGlobal();
  const expressions = input.split(';').filter((i) => i.trim() !== '');
  const output = expressions.map((e) => interpret(e, env));
  return output.pop();
}
