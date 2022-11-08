import { interpret, parse, scan, tokenize } from "../main";
import { Token } from "../token";

describe("Scan", () => {
	test("Can scan empty string into an empty list", () => {
		let given = "";
		let expected = [];
		let actual = scan(given);

		expect(actual).toEqual(expected);
	});

	test("Can scan expression string into a scanned list", () => {
		let given = "(+ 1 2)";
		let expected = ["(", "+", "1", "2", ")"];
		let actual = scan(given);

		expect(actual).toEqual(expected);
	});

	test("Can scan nested expression string into a scanned list", () => {
		let given = "(+ 1 (- 1 1))";
		let expected = ["(", "+", "1", "(", "-", "1", "1", ")", ")"];
		let actual = scan(given);

		expect(actual).toEqual(expected);
	});
});

describe("Tokenize", () => {
	test("Can tokenize scanned code into an AST", () => {
		let given = ["(", "+", "1", "1", "1", ")"];
		let expected = [
			Token.identifier("+"),
			Token.literal(1),
			Token.literal(1),
			Token.literal(1),
		];
		let actual = tokenize(given);

		expect(actual).toEqual(expected);
	});

	test("Can tokenize nested expressions", () => {
		let given = ["(", "+", "1", "(", "-", "1", "1", ")", ")"];
		let expected = [
			Token.identifier("+"),
			Token.literal(1),
			[Token.identifier("-"), Token.literal(1), Token.literal(1)],
		];
		let actual = tokenize(given);

		expect(actual).toEqual(expected);
	});
});

describe("Interpret", () => {
	test("Can evaluate simple calculator expression", () => {
		let given = parse("(+ 1 2 3)");
		let expected = 6;
		let actual = interpret(given);
		expect(actual).toEqual(expected);
	});

	test("Can evaluate nested calculator expression", () => {
		let given = parse("(+ 6 (+ 1 2 3) (- 10 4))");
		let expected = 18;
		let actual = interpret(given);
		expect(actual).toEqual(expected);
	});

	test("Can evaluate standard mathematical operations", () => {
		let given = parse("(/ (- 20 12) (+ 1 1) (* 1 2))");
		let expected = 2;
		let actual = interpret(given);
		expect(actual).toEqual(expected);
	});
});
