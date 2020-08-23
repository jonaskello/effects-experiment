/*
import { liftF, foldFree } from "fp-ts-contrib/lib/Free";
import { Free } from "fp-ts-contrib/lib/Free";
import { Identity, identity } from "fp-ts/lib/Identity";

// Creating set of instructions (AST)

export class Write<A> {
  _tag: "Write" = "Write";
  message: string;
  more: A;
  constructor(message: string, more: A) {
    this.message = message;
    this.more = more;
  }
}

export class Read<A> {
  _tag: "Read" = "Read";
  more: (input: string) => A;
  constructor(more: (input: string) => A) {
    this.more = more;
  }
}

export type ConsoleT = <U, L, A>(x: [U, L, A]) => Console<A>;

export type Console<A> = Write<A> | Read<A>;

export type ConsoleF<A> = Free<ConsoleT, A>;

// Creating the DSL

export const write = (message: string): ConsoleF<void> =>
  liftF(new Write(message, undefined));
export const read = (): ConsoleF<string> => liftF(new Read((a) => a));

// A program

// const program = write("What's your name?")
//   .chain(() => read())
//   .chain((name) => write(`Hello ${name}!`));

const program = write("What's your name?");
//   .chain(() => read())
//   .chain((name) => write(`Hello ${name}!`));

// Running the program

export function exaustive(x: never): never {
  return x;
}

export function identityInterpreter<A>(fa: Console<A>): Identity<A> {
  switch (fa._tag) {
    case "Write":
      console.log(fa.message);
      return identity.of(fa.more);
    case "Read":
      return identity.of(fa.more("Giulio"));
    default:
      return exaustive(fa);
  }
}

// program.foldFree(identity)(identityInterpreter);
foldFree(program, identity)(identityInterpreter);
// What's your name?
// Hello Giulio!


// Another Interpreter

import { IO, io } from "fp-ts/lib/IO";

export const prompt: IO<string> = new IO(() => window.prompt(""));
export const log = (message: string): IO<void> =>
  new IO(() => window.alert(message));

export function ioInterpreter<A>(fa: Console<A>): IO<A> {
  switch (fa._tag) {
    case "Write":
      const a = fa.more;
      return log(fa.message).map(() => a);
    case "Read":
      return prompt.map(fa.more);
    default:
      return exaustive(fa);
  }
}

program.foldFree(io)(ioInterpreter).run();
//   An alert, a prompt and another alert with the name you inserted will be displayed in the browser
*/
