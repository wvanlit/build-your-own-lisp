import { evaluate } from "../main";

describe("Project", () => {
  test("is operational", () => {
    expect(() => evaluate("")).toThrow();
  });
});
