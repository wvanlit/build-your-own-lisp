import { Token, TokenizedCode, TokenType } from "./token";

export const notImplemented = () => {
  throw new Error("Not Implemented");
};

export const invalid = () => {
  throw new Error("Invalid program state");
};

export const isNumber = (input: string) => !isNaN(parseFloat(input));

export const isToken = (tokenized: TokenizedCode): tokenized is Token =>
  tokenized instanceof Token;

export const isTokenType = (tokenized: TokenizedCode, type: TokenType) =>
  isToken(tokenized) && tokenized.type == type;

export const toToken = (t: TokenizedCode) => (isToken(t) ? t : invalid());

export const getTokenValueString = (t: TokenizedCode) =>
  isToken(t) ? t.value.toString() : invalid();

export const toTokenArray = (t: TokenizedCode) => (isToken(t) ? invalid() : t);
