import { parse } from './parser';

export const version = '0.1.0';

export function interpret(input: string): any {
  return evaluate(parse(input));
}

export function evaluate(input: any): any {}
