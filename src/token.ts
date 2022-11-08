export enum TokenType {
	Identifier,
	Literal,
}

export type TokenizedCode = Token | TokenizedCode[];
export type TokenValue = string | number | Identifier | Function | TokenValue[];
export type Function = (tokens: TokenValue[]) => TokenValue;
export type Identifier = string;

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
}
