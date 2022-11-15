# 003 - Functions

[ [previous step](./002%20-%20Variables.md) ]

The final steps to building our own Lisp interpreter is creating a way to reuse code, which we'll do using functions. Lisp has first class functions, which means that they are just like variables. You can define them, pass them around and even return them from other functions.

To make our life easier, we'll also implement if expressions, so that we can do conditional logic.

## End Result

```scheme
» (define square (lambda (x) (* x x)))
» (square 3)
9
» (define addX (lambda (x) (lambda (y) + x y))) ; First class function!
» (define add5 (addX 5))
» (add5 2)
7
» (define isFive (lambda (x) (if (= x 5) "yes" "no")))
» ((isFive 2) (isFive 5) (isFive 55))
[ 'no', 'yes', 'no', ]
```

# New Keywords

We'll need two new keywords in our interpreter: `lambda` and `if`. Add these to the `Keyword` enum in [`token.ts`](../src/token.ts).

Now that we have these two keywords, we also have to handle them in `interpretKeyword` in [`main.ts`](../src/main.ts)

1. Call `createLambda(context, args)` when the keyword is `Lambda`
1. Call `evalIf(context, args)` when the keyword is `If`

# If expressions

An if expression has the following syntax: `if <condition> <then> <else>`. For example:

```scheme
(if (= x 5) "yes" "no")
```

Create the function `evalIf` with parameters `(context: Context, input: TokenizedCode[])` in [`main.ts`](../src/main.ts).

It consists of the following steps:

1. The input contains 3 items, the `condition`, `thenBranch` and `elseBranch`
1. Interpret the `condition` within the current `Context`
1. If the result of interpreting `condition` equals `true` interpret the `thenBranch` else interpret the `elseBranch`. Return the value from this interpretation.

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
const evalIf = (context: Context, input: TokenizedCode[]) => {
  const [condition, thenBranch, elseBranch] = input;
  const result = interpret(condition, context);
  const branch = result == true ? thenBranch : elseBranch;
  return interpret(branch, context);
};
```

</details>

&nbsp;

# Lambda functions

A lambda function has the following syntax: `lambda <parameters> <body>`. For example:

```scheme
(lambda (x y) (+ 1 x (* 3 y)))
;       ↑     ⮤ body
;       parameters
```

Create the function `createLambda` with parameters `(context: Context, input: TokenizedCode[])` in [`main.ts`](../src/main.ts).

It consists of the following steps:

1. Get the function `parameters` and `body` from the `input`
   - The first item in `input` is the `parameters`
   - The second item is the `body`
1. Return a function that takes an array of `TokenValue`. This will be the lambda itself. Do the following in the function:
   1. In the function, build the scope for the function context. This is an object containing all function parameters as keys and all arguments as values.
      - For example, with parameters `(a b)` and arguments `(1 "yes")` it would be `{ a:1, b:"yes" }`
   1. Create a new `Context` with this scope and the current `Context` as a parent
   1. Interpret the `body` with this new `Context` and return the value.

<details> 
  <summary> <b>Hint</b>: <i>Building the scope</i> </summary>

```ts
// The index of the value in the argument array is equal to the item in the parameter array

const scope = {}; // Make an empty object, this will be filled later

for (let index = 0; index < args.length; index++) {
  // Get value of the Identifier token
  const parameter = toToken(params[index]).value.toString();

  const argument = args[index];

  scope[parameter] = argument;
}
```

</details>

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
const createLambda = (context: Context, input: TokenizedCode[]) => {
  const [params, body] = input;
  if (isToken(params)) return invalid();

  return (args: TokenValue[]) => {
    const scope = {};

    for (let index = 0; index < args.length; index++) {
      const argument = args[index];
      const parameter = getTokenValueString(params[index]);

      scope[parameter] = argument;
    }

    return interpret(body, new Context(scope, context));
  };
};
```

</details>
