# 001 - A Lisp Calculator

## End Result

```scheme
» (+ 1 2 3)
6
» (/ (+ 3 3) (- 3 1))
3
» ((+ 1 2 3) (+ 1 2 4) (+ 1 2 5))
[ 6, 7, 8 ]
```

## Scanning

The `scan` function takes in a string and preprocesses it for use during the tokenization step. It takes a string of code such as `"(+ 1 12 301)"` and turns it into a list of code 'chunks' that do not contain any whitespace. The example input would be turned into `[ "(", "+", "1", "12", "301", ")" ]`.

Add the following steps to the `scan` function in [`main.ts`](../src/main.ts):

1. Add space around the parentheses. Replace all `'('` with `' ( '` and all `')'` with `' ) '`.
   - This makes it easier to split code into chunks later
1. Trim any whitespace on the edges
1. Split on every space
   - Keep multiple spaces in mind!
1. Filter out any empty strings

If done correctly, all tests in `001-calculator.test.ts > Scan` should now pass.

<details> 
  <summary> <b>Hint</b>: <i>Replacing all instances of a string</i> </summary>

```js
string.replaceAll(replaceString, withString);

"ABBABBA".replaceAll("A", " A "); // => " A BB A BB A "
```

</details>

<details> 
  <summary> <b>Hint</b>: <i>Split on every space</i> </summary>

```js
string.split(/\s+/);

"A AB    BA".split(/\s+/); // => ["A", "AB", "BA"]
```

</details>
&nbsp;
<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
export const scan = (input: string): Scan => {
  return input
    .replaceAll("(", " ( ")
    .replaceAll(")", " ) ")
    .trim()
    .split(/\s+/);
};
```

</details>

&nbsp;

## Tokenize

Now that we have a list of code chunks, we can turn them into tokens. A token represents what the given string _means_ to the interpreter. For now, we only care about `literal` and `identifier` tokens. `literal` tokens represent a value, such as `45` or `"Hello World!"`. `identifier` tokens represent a reference to another value, such as the variable `x` or the `+` function.

For example, the string `12` will create a token with the type of `literal` and the value `12`, since it is a number. The string `"Hello"` is also a `literal`, but has a string value. The string `x` will create a token with the type of `identifier` with the value `x`, since it is not a number or a string (no quotes).

Tokenization makes it easier and faster to interpret the values later. Instead of parsing the values every time, it will create an [Abstract Syntax Tree](https://www.wikiwand.com/en/Abstract_syntax_tree) over which the interpreter can then iterate.

To make using tokens easier, [`token.ts`](../src/token.ts) has been created, containing the `Token` class and some useful helper functions.

Add the following steps to the `tokenize` function in [`main.ts`](../src/main.ts):

1. [`Shift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) the first value of `scanned`, this is the current token
1. If token is `undefined` return the last value from `tokens`
1. If token is `(`, this is the start of a new list.
   - Call `tokenize(scanned, [])`. This will tokenize the list
   - Push the result into `tokens`
   - Call `tokenize(scanned, tokens)`. This will continue tokenizing the rest of the scanned code
1. If token is `)`, this is the end of a list, return `tokens`
1. If token is none of these, then push the result of `categorize(token)` onto `tokens`. Then return `tokenize(scanned, tokens)`

<details> 
  <summary> <b>Hint</b>: <i>Tokenizing a list</i> </summary>

```js
const list = tokenize(scanned, []);
tokens.push(list);
return tokenize(scanned, tokens);
```

</details>

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
export const tokenize = (
  scanned: Scan,
  tokens: TokenizedCode[] = []
): TokenizedCode => {
  const token: ScannedCode | undefined = scanned.shift();

  switch (token) {
    case undefined:
      return tokens.pop()!; // Force not null/undefined
    case "(":
      const list = tokenize(scanned, []);
      tokens.push(list);
      return tokenize(scanned, tokens);
    case ")":
      return tokens;
    default:
      const categorized = categorize(token);
      const next = tokens.concat(categorized);
      return tokenize(scanned, next);
  }
};
```

</details>
&nbsp;

Add the following steps to the `categorize` function in [`main.ts`](../src/main.ts):

1. If input is a `number`, return a literal token with the input as a `number`.
1. If input is between two `"`'s, return a literal token with the input as a `string` and both `"`'s removed.
1. If input is neither, return an identifier token.

<details> 
  <summary> <b>Hint</b>: <i>Parsing a number</i> </summary>

```js
const number = parseFloat(input);

// Trying to parse a non number will return NaN (Not a Number)
// So to check if a string is a number:
const isNumber = !isNaN(parseFloat(input));
```

There is a helper function for checking `isNumber` in [`util.ts`](../src/util.ts)

</details>

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
export const categorize = (input: ScannedCode): Token => {
  if (isNumber(input)) return Token.literal(parseFloat(input));

  if (input.at(0) === `"` && input.at(-1) === `"`)
    return Token.literal(input.slice(1, -1));

  return Token.identifier(input);
};
```

</details>
&nbsp;

If done correctly, all tests in `001-calculator.test.ts > Tokenize` should now pass.

## Interpret

Finally, we can use our newly built `AbstractSyntaxTree` to evaluate our input code. We do this by recursively iterating over the `AbstractSyntaxTree`. However we might run into some issues when we try to evaluate an `identifier` token. How would we know what value a `+` is? This is where the `Context` comes into play.

The `Context` contains the current scope of the program, which consists of all defined identifiers (`x` is `4`, `y` is `2`, `+` is a function that adds 2+ numbers). In the next step we will also store variables in here, but for now it will only include our 'standard library', common functions and definitions that are always present. You can find the definitions in [`context.ts`](../src/context.ts).

Add the following steps to the `interpret` function in [`main.ts`](../src/main.ts):

1. If input is an `instanceof Array`, it is a list and should be handled by `interpretList`
1. If input has a `TokenType` of `Identifier` then we ask for it's value from the context.
1. If it is neither, then it is a `TokenType.Literal` and thus we return the value

<details> 
  <summary> <b>Hint</b>: <i>Determining type of a variable</i> </summary>

```js
// If the value is a primitive
const isString = typeof input === "string";

// If the value is an object
const isArray = input instanceof Array;
```

</details>

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
export const interpret = (
  input: AbstractSyntaxTree,
  context: Context = Context.StandardLibrary()
) => {
  if (input instanceof Array) return interpretList(input, context);
  if (input.type === TokenType.Identifier)
    return context.get(input.value as Identifier);
  return input.value;
};
```

</details>
&nbsp;

Add the following steps to the `interpretList` function in [`main.ts`](../src/main.ts):

1. Interpret all the values in the input array
1. If the first value in the list is an `instanceof Function` and the rest of the array is larger than zero, call the function with body as its parameters and return its value.
1. Else return the list

<details> 
  <summary> <b>Hint</b>: <i>Calling a function from a variable</i> </summary>

```js
// The first parameter is the value to use as `this` when calling the function. Not relevant for us.
const output = func.call(undefined, parameters);
```

</details>

<details> 
  <summary> <b>Possible Solution</b>: <i>If you're stuck</i> </summary>

```ts
const interpretList = (input: TokenizedCode[], context: Context) => {
  const list: TokenValue = input.map((x) => interpret(x, context));
  const [head, ...body] = list;

  if (head instanceof Function && body.length >= 1)
    return head.call(undefined, body);
  else return list;
};
```

</details>
&nbsp;

If done correctly, all tests in `001-calculator.test.ts > Interpret` should now pass.

Run `npm run start` to start the REPL, and experiment with the code you've just written.

Some things to try:

- `(+ 1 2 3)`
- `(- (+ 1 2 3) (* 1 2 3))`
- `(/ 1 2 3)`
- `("Hello" "World" "!")`
