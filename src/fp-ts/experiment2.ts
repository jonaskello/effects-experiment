import * as T from "fp-ts/lib/Task";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/pipeable";

const main = pipe(
  sequenceT(T.task)(T.of(42), T.of("tim")), //[F[A], F[B]] => F[A, B]
  T.map(([answer, name]) =>
    console.log(`Hello ${name}! The answer you're looking for is ${answer}`)
  )
);

main();
