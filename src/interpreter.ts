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

const ENABLE_TRACE = false;
const trace = (msg: string) => {
  if (ENABLE_TRACE) console.log(msg);
};

export function evaluate(exp: TExpression, env: Environment): TExpression {
  if (isAtom(exp)) {
    if (isSymbol(exp)) {
      return env.find(exp as TSymbol);
    }

    if (isNumber(exp)) {
      return exp;
    }
  } else {
    trace(`List: ${exp}`);
    if ((exp as TList).length === 0) return [];

    const [op, ...rest] = (exp as TList)!;

    if (op === 'if') {
      const [test, trueBranch, elseBranch] = rest;
      const condition = evaluate(test, env);
      const next = condition ? trueBranch : elseBranch;

      trace(`If: ${test} = ${condition} => ${next}`);
      return evaluate(next, env);
    }

    if (op === 'define') {
      const [symbol, body] = rest;
      const evalBody = evaluate(body, env);
      env.envs[symbol as TSymbol] = evalBody;

      trace(`Define: ${symbol} -> ${evalBody}`);
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

    trace(`Procedure: ${op} (${args})`);

    return procedure(...args);
  }

  throw new EvalError(`Unknown expression found: '${exp}'`);
}
