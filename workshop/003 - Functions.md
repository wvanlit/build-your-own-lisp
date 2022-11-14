# 003 - Functions

[ [previous step](./002%20-%20Variables.md) | [next step](./004%20-%20Next%20Steps.md) ]

## End Result

```scheme
» (define square (lambda (x) * x x))
» (square 3)
9
» (define add (lambda (x) lambda (y) + x y)) ; First Class function!
» (define add5 (add 5))
» (add5 2)
7
» (define isFive (lambda (x) if (= x 5) "yes" "no"))
» ((isFive 2) (isFive 5) (isFive 55))
[ 'no', 'yes', 'no', ]
```

# New Keywords

```ts
case Keyword.Lambda:
    return createLambda(context, body);
case Keyword.If:
    return evalIf(context, body);
```

# Lambda functions

```ts
const createLambda = (context: Context, input: TokenizedCode[]) => {
  return (args: TokenValue[]) => {
    const [params, ...body] = input;
    if (isToken(params)) return invalid();

    const scope = params.reduce((acc, x, i) => {
      if (!isToken(x)) return invalid();
      acc[x.value.toString()] = args[i];
      return acc;
    }, {});

    return interpret(body, new Context(scope, context));
  };
};
```

# If expressions

```ts
const evalIf = (context: Context, input: TokenizedCode[]) => {
  const [condition, thenBranch, elseBranch] = input;
  const result = interpret(condition, context);
  const branch = result == true ? thenBranch : elseBranch;
  return interpret(branch, context);
};
```

# Standard Library scope

```ts
const scope = {
  "#t": true,
  "#f": false,

  "+": operator((total, curr) => total + curr),
  "-": operator((total, curr) => total - curr),
  "/": operator((total, curr) => total / curr),
  "*": operator((total, curr) => total * curr),

  "<": boolOperator((a, b) => a < b),
  ">": boolOperator((a, b) => a > b),
  "<=": boolOperator((a, b) => a <= b),
  ">=": boolOperator((a, b) => a >= b),

  "=": boolOperator((a, b) => a === b),
  "!=": boolOperator((a, b) => a !== b),
};
```
