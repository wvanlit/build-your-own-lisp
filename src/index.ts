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
