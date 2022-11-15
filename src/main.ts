import { Context } from "./context";
import {
  AbstractSyntaxTree,
  getKeyword,
  Identifier,
  Keyword,
  Token,
  TokenizedCode,
  TokenType,
  TokenValue,
} from "./token";
import {
  getTokenValueString,
  invalid,
  isNumber,
  isToken,
  isTokenType,
  toToken,
} from "./util";

type ScannedCode = string;
type Scan = ScannedCode[];

export const scan = (input: string): Scan => {
  return input
    .replaceAll("(", " ( ")
    .replaceAll(")", " ) ")
    .trim()
    .split(/\s+/);
};

export const tokenize = (
  scanned: Scan,
  tokens: TokenizedCode[] = []
): AbstractSyntaxTree => {
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

export const categorize = (input: ScannedCode): Token => {
  if (isNumber(input)) return Token.literal(parseFloat(input));

  if (input.at(0) === `"` && input.at(-1) === `"`)
    return Token.literal(input.slice(1, -1));

  if (getKeyword(input)) return Token.keyword(getKeyword(input));

  return Token.identifier(input);
};

export const parse = (input: string) => tokenize(scan(input));

export const interpret = (
  input: AbstractSyntaxTree,
  context: Context = Context.StandardLibrary()
) => {
  if (input instanceof Array) return interpretList(input, context);
  if (input.type === TokenType.Identifier)
    return context.get(input.value as Identifier);
  return input.value;
};

const interpretList = (input: TokenizedCode[], context: Context) => {
  if (isTokenType(input[0], TokenType.Keyword))
    return interpretKeyword(input, context);

  const list: TokenValue = input.map((x) => interpret(x, context));
  const [head, ...body] = list;

  if (head instanceof Function && body.length >= 1)
    return head.call(undefined, body);
  else return list;
};

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
    case Keyword.Lambda:
      return createLambda(context, args);
    case Keyword.If:
      return evalIf(context, args);
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

const evalIf = (context: Context, args: TokenizedCode[]) => {
  const [condition, thenBranch, elseBranch] = args;
  const result = interpret(condition, context);
  const branch = result == true ? thenBranch : elseBranch;
  return interpret(branch, context);
};

export const evaluate = (input: string, context?: Context) =>
  interpret(parse(input), context);
