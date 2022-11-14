# 002 - Variables

[ [previous step](./001%20-%20A%20Lisp%20Calculator.md) | [next step](./003%20-%20Functions.md) ]

## End Result

```scheme
» (define x 3)
» (/ 9 x)
3
» (set! y 4)
» (+ x y)
7
```

## Keywords

### Categorize

```ts
export const categorize = (input: ScannedCode): Token => {
  if (!isNaN(parseFloat(input))) return Token.literal(parseFloat(input));

  if (input.at(0) === `"` && input.at(-1) === `"`)
    return Token.literal(input.slice(1, -1));

  if (getKeyword(input)) return Token.keyword(getKeyword(input));

  return Token.identifier(input);
};
```

### Interpret

```ts
const interpretList = (input: TokenizedCode[], context: Context) => {
  if (isToken(input[0]) && input[0].type === TokenType.Keyword)
    return interpretKeyword(input, context);

  const list: TokenValue = input.map((x) => interpret(x, context));
  const [head, ...body] = list;

  if (head instanceof Function && body.length >= 1)
    return head.call(undefined, body);
  else return list;
};

const interpretKeyword = (input: TokenizedCode[], context: Context) => {
  const [head, ...body] = input;
  const type = <Keyword>(head as Token).value;

  switch (type) {
    case Keyword.Define:
      defineVariable(context, body);
      break;
    case Keyword.Set:
      setGlobalVariable(context, body);
      break;
    case Keyword.Lambda:
      return createLambda(context, body);
    case Keyword.If:
      return evalIf(context, body);
  }
};
```

## Writing to Context

```ts
const defineVariable = (context: Context, body: TokenizedCode[]) => {
  const [variable, value] = body;
  if (!isToken(variable)) return invalid();
  context.set(variable.value.toString(), interpret(value, context));
};

const setGlobalVariable = (context: Context, body: TokenizedCode[]) => {
  const [variable, value] = body;
  if (!isToken(variable)) return invalid();
  context.setGlobal(variable.value.toString(), interpret(value, context));
};
```

## Context & Scope

```ts
get(identifier: Identifier) {
  if (identifier in this.scope) return this.scope[identifier];
  if (this.parent !== undefined) return this.parent.get(identifier);
  else throw new Error(`Identifier '${identifier}' could not be found.`);
}

set(identifier: Identifier, value: TokenValue) {
  this.scope[identifier] = value;
}

setGlobal(identifier: Identifier, value: TokenValue) {
  if (this.parent === undefined) this.set(identifier, value);
  else this.parent.setGlobal(identifier, value);
}
```
