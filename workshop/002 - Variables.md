# 002 - Variables

[ [previous step](./001%20-%20A%20Lisp%20Calculator.md) | [next step](./003%20-%20Functions.md) ]

A programming language needs a way to store something in memory. Most languages use variables, and Lisp does as well. In this step we'll build both local and global variables using the `define` and `set!` keyword. The difference between these two is that variables defined using `define` are added to the current context (_local_), while variables set using `set!` are added to the root/top context (_global_).

## End Result

```scheme
» (define x 3)
» (/ 9 x)
3
» (set! y 4)
» (+ x y)
7
```

## Categorizing Keywords

An variable definition has the following syntax: `define <identifier> <value>` or `set! <identifier> <value>`. For example:

```scheme
(define x 2)
(set! y 4)
```

We first need to recognize the keywords `define` and `set!` before we can start adding behavior to them. To distinguish between keywords and identifiers, we have a `Keyword` token. It takes a `Keyword` enum as a value. We set this token during categorization. When interpreting, we can then identify the keywords by its TokenType.

Add the following values to the `Keyword` enum in [`token.ts`](../src/token.ts):

1. `Define = "define"`
1. `Set = "set!"`

Add the following steps to the `categorize` function in [`main.ts`](../src/main.ts):

1. If input is in the `Keyword` enum (use `getKeyword` from `token.ts`), return a `Keyword` token
   - Put the code after checking if the token is a string `literal`, but before returning the `identifier`

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
export const categorize = (input: ScannedCode): Token => {
  if (!isNaN(parseFloat(input))) return Token.literal(parseFloat(input));

  if (input.at(0) === `"` && input.at(-1) === `"`)
    return Token.literal(input.slice(1, -1));

  // This line was added
  if (getKeyword(input)) return Token.keyword(getKeyword(input));

  return Token.identifier(input);
};
```

</details>

&nbsp;

## Saving variables in context

The next step is using these `Keyword` tokens in the interpreter. We can check for a `Keyword` token in `interpretList`. If we find a `Keyword`, we execute special behavior dependent on which `Keyword` it is.

Add the following steps to the `interpretList` function in [`main.ts`](../src/main.ts):

1. Check if the first input of the list is a single token (not another list) and if the type is `Keyword`.
1. If `true`, return `interpretKeyword(input, context);`
1. If `false`, continue with normal execution

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
const interpretList = (input: TokenizedCode[], context: Context) => {
  // Added Code
  if (isTokenType(input[0], TokenType.Keyword))
    return interpretKeyword(input, context);

  // Existing code
  const list: TokenValue = input.map((x) => interpret(x, context));
  const [head, ...body] = list;

  if (head instanceof Function && body.length >= 1)
    return head.call(undefined, body);
  else return list;
};
```

</details>

&nbsp;

Next create the `interpretKeyword` function in [`main.ts`](../src/main.ts) and add these steps:

1. Get the first value in `input`, this is the token with `TokenType` `Keyword`.
1. Get the keyword value from the token and put it into `type`
1. Put the remaining values from `input` in `args`, these will be the arguments / extra information for the `Keyword` specific behavior.
1. If `type` is `Keyword.Define`
   - The first value in the `args` list is the `variable`
   - The second value is the `value`
   - If `variable` isn't a `Token` (use `isToken(variable)`), throw an error (call `invalid()`)
     - This tells the Typescript compiler that `variable` isn't a `Token[]`
   - Set the context for the variable to the interpreted `value` (`context.set`)
1. If `type` is `Keyword.Set`
   - The first value in the `args` list is the `variable`
   - The second value is the `value`
   - If `variable` isn't a `Token` (use `isToken(variable)`), throw an error (call `invalid()`)
     - This tells the Typescript compiler that `variable` isn't a `Token[]`
   - Set the global context for the `variable` to the interpreted `value` (`context.setGlobal`)

<details> 
  <summary> <b>Hint</b>: <i>Forcing a type in Typescript</i> </summary>

```ts
// This is an example to show how we could 'force' the Typescript compiler to think a variable is a certain type.

// We know this is a Token, but TokenizedCode could also be a Token[]
const keywordToken: TokenizedCode = Token.keyword(Keyword.Define);

// Force it into Token, enforcing that it isn't an array
const token = keywordToken as Token;

// Force the value to of type Keyword
const keyword = <Keyword>token.value;

// Both in one line
const keywordOneliner = <Keyword>(keywordToken as Token).value;
```

</details>

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
const interpretKeyword = (input: TokenizedCode[], context: Context) => {
  const [head, ...args] = input;
  const type = <Keyword>(head as Token).value;

  switch (type) {
    case Keyword.Define:
      defineVariable(context, args);
      break;
    case Keyword.Set:
      setGlobalVariable(context, args);
      break;
  }
};

const defineVariable = (context: Context, args: TokenizedCode[]) => {
  const [variable, value] = args;
  context.set(getTokenValueString(variable), interpret(value, context));
};

const setGlobalVariable = (context: Context, args: TokenizedCode[]) => {
  const [variable, value] = args;
  context.setGlobal(getTokenValueString(variable), interpret(value, context));
};
```

</details>

&nbsp;

If done correctly, all tests in `002-variables.test.ts` should now pass.

Run `npm run start` to start the REPL, and experiment with the code you've just written.

Some things to try:

- `(define x 4)` then `(set! y 8)` then `(+ x y)`
- `(define world "World")` then `("Hello" world "!")`

[ [previous step](./001%20-%20A%20Lisp%20Calculator.md) | [next step](./003%20-%20Functions.md) ]
