import { Context } from "./context";
import {
  getKeyword,
  Identifier,
  isToken,
  Keyword,
  Token,
  TokenizedCode,
  TokenType,
  TokenValue,
} from "./token";
import { invalid } from "./util";

type ScannedCode = string;
type Scan = ScannedCode[];

export const scan = (input: string): Scan => {
  return input
    .replaceAll("(", " ( ")
    .replaceAll(")", " ) ")
    .trim()
    .split(/\s+/)
    .filter((s) => s != "");
};

export const tokenize = (
  scanned: Scan,
  list: TokenizedCode[] = []
): TokenizedCode => {
  const token: ScannedCode | undefined = scanned.shift();

  switch (token) {
    case undefined:
      return list.pop()!;
    case "(":
      list.push(tokenize(scanned, []));
      return tokenize(scanned, list);
    case ")":
      return list;
    default:
      return tokenize(scanned, list.concat(categorize(token)));
  }
};

export const categorize = (input: ScannedCode): Token => {
  if (!isNaN(parseFloat(input))) return Token.literal(parseFloat(input));

  if (input[0] === `"` && input[-1] === `"`)
    return Token.literal(input.slice(1, -1));

  if (getKeyword(input)) return Token.keyword(getKeyword(input));

  return Token.identifier(input);
};

export const parse = (input: string) => tokenize(scan(input));

export const interpret = (
  input: TokenizedCode,
  context: Context = Context.StandardLibrary()
) => {
  if (input instanceof Array) return interpretList(input, context);
  if (input.type === TokenType.Identifier)
    return context.get(input.value as Identifier);
  return input.value;
};

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

const evalIf = (context: Context, input: TokenizedCode[]) => {
  const [condition, thenBranch, elseBranch] = input;
  const result = interpret(condition, context);
  const branch = result == true ? thenBranch : elseBranch;
  return interpret(branch, context);
};

export const evaluate = (input: string, context?: Context) =>
  interpret(parse(input), context);
