import { clear, log } from "console";
import prompts from "prompts";
import kleur from "kleur";
import { Context } from "./context";
import { evaluate } from "./main";
import { TokenValue } from "./token";

clear();
intro();

const context = Context.StandardLibrary();

while (true) {
  const answer = await prompts({
    type: "text",
    name: "input",
    message: "",
  });

  const input: string = answer.input.toString();

  if (input === "exit" || input === "") break;

  try {
    const value = evaluate(input, context);
    if (value !== undefined) log(color(value));
  } catch (err) {
    const error = err as Error;
    log(kleur.bold().red(error.message));
  }
}

function intro() {
  const toLines = (word: string, color) =>
    word
      .split("\n")
      .filter((s) => s)
      .map(color);

  const build = toLines(
    String.raw`
|_    .| _|
|_)|_|||(_|
           `,
    kleur.bold().yellow
  );

  const your = toLines(
    String.raw`
   _     _
\/(_)|_|| 
/         `,
    kleur.bold().cyan
  );

  const own = toLines(
    String.raw`
 _   _   _  
(_)\/ \/| \|
            `,
    kleur.bold().blue
  );

  const lisp = toLines(
    String.raw`
|. _ _ 
||_)|_)
    |   `,
    kleur.bold().green
  );

  const top = [build[0], your[0], own[0], lisp[0]].join(" ");
  const middle = [build[1], your[1], own[1], lisp[1]].join(" ");
  const bottom = [build[2], your[2], own[2], lisp[2]].join(" ");

  log(top);
  log(middle);
  log(bottom);

  const enterKey = kleur.bold().green("Enter");
  log(`Type an expression and press ${enterKey} to evaluate`);

  const exit = kleur.bold().red("exit");
  log(`An empty expression or typing ${exit} will quit the interpreter`);
}

function color(input: TokenValue) {
  switch (typeof input) {
    case "string":
      return kleur.green(`'${input}'`);
    case "number":
      return kleur.blue(input);
    case "object":
      if (input instanceof Array) {
        return `[ ${input.map(color).join(", ")} ]`;
      }
    case "boolean":
      return kleur.yellow(input ? "true" : "false");
  }
}
