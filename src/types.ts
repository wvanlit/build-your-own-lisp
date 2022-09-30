export type TUnit = [];
export type TSymbol = string;
export type TNumber = number;
export type TBool = boolean;
export type TAtom = TSymbol | TNumber | TBool;
export type TList = Array<TExpression>;
export type TExpression = TUnit | TAtom | TList | TProcedure;
export type TProcedure = (...expressions: TExpression[]) => TExpression;

export class Environment {
  envs: { [key: TSymbol]: TExpression };
  outer: Environment | undefined;

  constructor(outer?: Environment) {
    this.envs = {};
    this.outer = outer;
  }

  find(symbol: TSymbol): TExpression {
    if (symbol in this.envs) return this.envs[symbol];
    if (this.outer !== undefined) return this.outer.find(symbol);
    throw new EvalError(`Could not find '${symbol}'`);
  }

  parameters(params: TList, args: TList) {
    params.forEach((param, index) => {
      this.set(param as TSymbol, args[index]);
    });
  }

  set(symbol: TSymbol, expression: TExpression) {
    this.envs[symbol] = expression;
  }

  addReducible = (
    symbol: TSymbol,
    reducer: (previousValue: any, currentValue: any) => TExpression
  ) => {
    this.set(symbol, (...expr: TExpression[]) => expr.reduce(reducer));
  };

  addConditionOnAll = (
    symbol: TSymbol,
    condition: (previousValue: any, currentValue: any) => TExpression
  ) => {
    this.set(symbol, (...expr: TExpression[]) => {
      let curr = expr.shift()!;
      for (const expression of expr) {
        if (!condition(curr, expression)) return false;
      }
      return true;
    });
  };

  static CreateGlobal() {
    const env = new Environment();

    env.set('#t', true);
    env.set('#f', false);

    env.set('pi', Math.PI);

    env.addReducible('+', (prev, curr) => prev + curr);
    env.addReducible('-', (prev, curr) => prev - curr);
    env.addReducible('*', (prev, curr) => prev * curr);
    env.addReducible('/', (prev, curr) => prev / curr);

    env.addConditionOnAll('=', (prev, curr) => prev == curr);
    env.addConditionOnAll('!=', (prev, curr) => prev !== curr);
    env.addConditionOnAll('>', (prev, curr) => prev > curr);
    env.addConditionOnAll('>=', (prev, curr) => prev >= curr);
    env.addConditionOnAll('<', (prev, curr) => prev < curr);
    env.addConditionOnAll('<=', (prev, curr) => prev <= curr);

    env.set('bool?', (...expr: TExpression[]) => isBool(expr[0]));
    env.set('number?', (...expr: TExpression[]) => isNumber(expr[0]));
    env.set('atom?', (...expr: TExpression[]) => isAtom(expr[0]));
    env.set('list?', (...expr: TExpression[]) => isList(expr[0]));

    env.set('list', (...expr: TExpression[]) => expr as TList);

    return env;
  }
}

export const isSymbol = (exp: TExpression) => typeof exp === 'string';
export const isBool = (exp: TExpression) => typeof exp === 'boolean';
export const isNumber = (exp: TExpression) => typeof exp === 'number';
export const isAtom = (exp: TExpression) =>
  isSymbol(exp) || isNumber(exp) || isBool(exp);
export const isList = (exp: TExpression) => exp instanceof Array;
