import * as assert from "assert";
import { identity } from "fp-ts/lib/function";
import { Semigroup, semigroupSum } from "fp-ts/lib/Semigroup";
import { Identity, identity as id, URI as IdURI } from "fp-ts/lib/Identity";
import { Do } from "fp-ts-contrib/lib/Do";
import * as Free from "fp-ts-contrib/lib/Free";

const URI = "Expr";
type URI = typeof URI;

class Add<A> {
  readonly _URI!: URI;
  readonly _A!: A;
  readonly _tag: "Add" = "Add";
  constructor(
    readonly M: Semigroup<A>,
    readonly a: A,
    readonly b: A,
    readonly next: (result: A) => A
  ) {}
}
class Lit<A> {
  readonly _URI!: URI;
  readonly _A!: A;
  readonly _tag: "Lit" = "Lit";
  constructor(readonly value: A, readonly next: (result: A) => A) {}
}
type ExprF<A> = Add<A> | Lit<A>;

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    Expr: ExprF<A>;
  }
}

const add = <A>(M: Semigroup<A>) => (a: A, b: A) =>
  Free.liftF(new Add(M, a, b, identity));
const lit = <A>(a: A) => Free.liftF(new Lit(a, identity));

const program = Do(Free.free)
  .bind("two", lit(2))
  .bind("three", lit(3))
  .bindL("sum", ({ two, three }) => add(semigroupSum)(two, three))
  .return(({ sum }) => sum);

assert.strictEqual(Free.isImpure(program), true);

const idEval = <A>(fa: ExprF<A>): Identity<A> => {
  switch (fa._tag) {
    case "Lit":
      return id.of(fa.next(fa.value));
    case "Add":
      return id.of(fa.next(fa.M.concat(fa.a, fa.b)));
  }
};

const result = Free.foldFree(id)(idEval, program);
assert.strictEqual(result, 5);

const programId = Free.hoistFree<URI, IdURI>(idEval)(program);
const result2 = Free.foldFree(id)(identity, programId);
assert.strictEqual(result2, 5);
