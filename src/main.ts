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
  notImplemented,
} from "./util";

type ScannedCode = string;
type Scan = ScannedCode[];

export const parse = (input: string) => tokenize(scan(input));

export const evaluate = (input: string, context?: Context) =>
  interpret(parse(input), context);

export const scan = (input: string): Scan => {
  return notImplemented();
};

export const tokenize = (
  scanned: Scan,
  tokens: TokenizedCode[] = []
): AbstractSyntaxTree => {
  return notImplemented();
};

export const categorize = (input: ScannedCode): Token => {
  return notImplemented();
};

export const interpret = (
  input: AbstractSyntaxTree,
  context: Context = Context.StandardLibrary()
) => {
  return notImplemented();
};

const interpretList = (input: TokenizedCode[], context: Context) => {
  return notImplemented();
};
