import {
  TExpression,
  Environment,
  TSymbol,
  isSymbol,
  isNumber,
  isAtom,
  TList,
  TProcedure,
  TAtom,
} from './types';

export function evaluate(exp: TExpression, env: Environment): TExpression {
  if (isAtom(exp)) {
    if (isSymbol(exp)) {
      return env.find(exp as TSymbol);
    }

    if (isNumber(exp)) {
      return exp;
    }
  } else {
    if ((exp as TList).length === 0) return [];

    const [op, ...rest] = (exp as TList)!;

    if (op === 'if') {
      const [test, trueBranch, elseBranch] = rest;
      const next = evaluate(test, env) ? trueBranch : elseBranch;
      return evaluate(next, env);
    }

    if (op === 'define') {
      const [symbol, func] = rest;
      env.envs[symbol as TSymbol] = func;
      return [];
    }

    if (op === 'lambda') {
      const [params, body] = rest;
      return (...args: TExpression[]) => {
        const inner = new Environment(env);
        inner.parameters(params as TList, args);
        return evaluate(body, inner);
      };
    }

    const procedure = evaluate(op, env) as TProcedure;
    const args = rest.map((ex) => evaluate(ex, env));

    console.log(`Calling ${op} with ${args}`);
    return procedure(...args);
  }

  throw new EvalError(`Unknown expression found: '${exp}'`);
}
