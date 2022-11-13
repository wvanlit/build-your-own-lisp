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

  set(identifier: Identifier, value: TokenValue) {
    this.scope[identifier] = value;
  }

  setGlobal(identifier: Identifier, value: TokenValue) {
    if (this.parent === undefined) this.set(identifier, value);
    else this.parent.setGlobal(identifier, value);
  }

  static StandardLibrary(): Context {
    const operator =
      (f: (total: any, curr: any) => TokenValue) =>
      (params: TokenValue[]): TokenValue =>
        params.reduce((t, c) => f(t, c));

    const boolOperator =
      (f: (a: any, b: any) => TokenValue) =>
      (params: TokenValue[]): TokenValue =>
        params.every((a, i, arr) => (i == 0 ? true : f(arr[i - 1], a)));

    const scope = {
      "#t": true,
      "#f": false,

      "+": operator((total, curr) => total + curr),
      "-": operator((total, curr) => total - curr),
      "/": operator((total, curr) => total / curr),
      "*": operator((total, curr) => total * curr),

      "<": boolOperator((a, b) => a < b),
      ">": boolOperator((a, b) => a > b),
      "<=": boolOperator((a, b) => a <= b),
      ">=": boolOperator((a, b) => a >= b),

      "=": boolOperator((a, b) => a === b),
      "!=": boolOperator((a, b) => a !== b),
    };

    return new Context(scope);
  }
}
