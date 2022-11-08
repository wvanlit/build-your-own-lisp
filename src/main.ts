import { Context } from "./context";
import {
	Identifier,
	Token,
	TokenizedCode,
	TokenType,
	TokenValue,
} from "./token";

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
			list.push(tokenize(scanned, []) as TokenizedCode);
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
	else return Token.identifier(input);
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
	const list: TokenValue = input.map((x) => interpret(x, context));
	const [head, ...body] = list;
	if (head instanceof Function && body.length >= 1)
		return head.call(undefined, body);
	else return list;
};
