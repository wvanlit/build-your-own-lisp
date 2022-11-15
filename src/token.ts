export type AbstractSyntaxTree = TokenizedCode;

export type TokenizedCode = Token | TokenizedCode[];

export type TokenValue =
  | boolean
  | string
  | number
  | Identifier
  | Lambda
  | TokenValue[];

export type Lambda = (tokens: TokenValue[]) => TokenValue;

export type Identifier = string;

export enum TokenType {
  Identifier,
  Literal,
  Keyword,
}

export enum Keyword {
  Define = "define",
  Set = "set!",
  Lambda = "lambda",
  If = "if",
}

export class Token {
  type: TokenType;
  value: TokenValue;
  constructor(type: TokenType, value: TokenValue) {
    this.type = type;
    this.value = value;
  }

  static identifier(identifier: Identifier) {
    return new Token(TokenType.Identifier, identifier);
  }

  static literal(literal: TokenValue) {
    return new Token(TokenType.Literal, literal);
  }

  static keyword(keyword: Keyword) {
    return new Token(TokenType.Keyword, keyword);
  }
}

export const getKeyword = (input: string): Keyword | undefined => {
  const found = Object.entries(Keyword).find(
    ([, literal]) => literal === input
  );

  return found === undefined ? undefined : found[1];
};
