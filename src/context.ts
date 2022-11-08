import { Identifier, Token, TokenValue } from "./token";

export type ExecutionScope = { [key: Identifier]: TokenValue };

export class Context {
	scope: ExecutionScope;
	parent: Context | undefined;

	constructor(scope: ExecutionScope, parent?: Context) {
		this.scope = scope;
		this.parent = parent;
	}

	get(identifier: Identifier) {
		if (identifier in this.scope) return this.scope[identifier];
		if (this.parent !== undefined) return this.parent.get(identifier);
		else throw new Error(`Identifier '${identifier}' could not be found.`);
	}

	static StandardLibrary(): Context {
		const operator =
			(f: (total: any, curr: any) => TokenValue) =>
			(params: TokenValue[]): TokenValue =>
				params.reduce((t, c) => f(t, c));

		const scope = {
			"+": operator((total, curr) => total + curr),
			"-": operator((total, curr) => total - curr),
			"/": operator((total, curr) => total / curr),
			"*": operator((total, curr) => total * curr),
		};

		return new Context(scope);
	}
}
