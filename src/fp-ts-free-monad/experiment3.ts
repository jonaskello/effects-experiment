import * as assert from "assert";
import { identity } from "fp-ts/lib/function";
import { Semigroup, semigroupSum } from "fp-ts/lib/Semigroup";
import { Identity, identity as id, URI as IdURI } from "fp-ts/lib/Identity";
import * as Free from "fp-ts-contrib/lib/Free";
import { chain } from "fp-ts-contrib/lib/Free";

// Creating set of instructions (AST)

const URI = "Expr2";
type URI = typeof URI;

export class Write<A> {
  readonly _URI!: URI;
  readonly _tag: "Write" = "Write";
  readonly _A!: A;
  //   constructor(message: string, more: A) {
  //     this.message = message;
  //     this.more = more;
  //   }
  constructor(readonly value: A, readonly next: (result: A) => A) {}
}

export class Read<A> {
  readonly _URI!: URI;
  readonly _tag: "Read" = "Read";
  readonly _A!: A;
  //   readonly more: (input: string) => A;
  //   constructor(more: (input: string) => A) {
  //     this.more = more;
  //   }
  constructor(readonly next: (result: A) => A) {}
}
type ExprF<A> = Write<A> | Read<A>;

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    Expr2: ExprF<A>;
  }
}

// export type ConsoleT = <U, L, A>(x: [U, L, A]) => Console<A>;

// export type Console<A> = Write<A> | Read<A>;

// export type ConsoleF<A> = Free<ConsoleT, A>;

// Creating the DSL

// export const write = (message: string): ConsoleF<void> =>
//   liftF(new Write(message, undefined));
// export const read = (): ConsoleF<string> => liftF(new Read((a) => a));

const write = <A>(a: A) => Free.liftF(new Write(a, identity));
const read = <A>() => Free.liftF(new Read(identity));

// A program

// const program = write("What's your name?")
//   .chain(() => read())
//   .chain((name) => write(`Hello ${name}!`));

const program = chain(() => write("What's your name?"))(read());
//   .chain((name) => write(`Hello ${name}!`));

// Running the program

export function exaustive(x: never): never {
  return x;
}

// export function identityInterpreter<A>(fa: Console<A>): Identity<A> {
//   switch (fa._tag) {
//     case "Write":
//       console.log(fa.message);
//       return identity.of(fa.more);
//     case "Read":
//       return identity.of(fa.more("Giulio"));
//     default:
//       return exaustive(fa);
//   }
// }

const idEval = <A>(fa: ExprF<A>): Identity<A> => {
  switch (fa._tag) {
    case "Write":
      return id.of(fa.next(fa.value));
    case "Read":
      return id.of(fa.next("Giulio" as any));
    default:
      return exaustive(fa);
  }
};

// program.foldFree(identity)(identityInterpreter);
// foldFree(program, identity)(identityInterpreter);
export const result = Free.foldFree(id)(idEval, program);

/*
What's your name?
Hello Giulio!
*/

// Another Interpreter

// import { IO, io } from "fp-ts/lib/IO";

// export const prompt: IO<string> = new IO(() => window.prompt(""));
// export const log = (message: string): IO<void> =>
//   new IO(() => window.alert(message));

// export function ioInterpreter<A>(fa: Console<A>): IO<A> {
//   switch (fa._tag) {
//     case "Write":
//       const a = fa.more;
//       return log(fa.message).map(() => a);
//     case "Read":
//       return prompt.map(fa.more);
//     default:
//       return exaustive(fa);
//   }
// }

// program.foldFree(io)(ioInterpreter).run();
/*
  An alert, a prompt and another alert with the name you inserted will be displayed in the browser
*/
