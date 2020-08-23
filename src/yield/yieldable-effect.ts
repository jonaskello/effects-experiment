import { getUser, EffectRequest, getUser2 } from "../shared/effect-descriptors";
import { effectToPromise } from "../shared/effect-to-promise";
import { Y } from "./typing-work-around";

export function* userAge() {
  // inferred type is correct.
  const user = yield* Y(getUser("1"));
  const user2 = yield* Y(getUser2("1"));
  // Calling sub-functions that also does effects
  const moreUsers = yield* getTwoUsers("1", "2");
  const moreUsers2 = yield* getTwoUsers("3", "4");
  // Cheating is not possible, we can only yield approved effects
  // const result = await fetch("http://www.sunet.se");
  return [user.age, user2.shoeSize];
}

const myGetUser = (id: string) => Y(getUser(id));
const myGetUser2 = (id: string) => Y(getUser2(id));

export function* userAgeTest2() {
  // inferred type is correct.
  const user = yield* myGetUser("1");
  const user2 = yield* myGetUser2("1");
  // Calling sub-functions that also does effects
  const moreUsers = yield* getTwoUsers("1", "2");
  const moreUsers2 = yield* getTwoUsers("3", "4");
  // Cheating is not possible, we can only yield approved effects
  // const result = await fetch("http://www.sunet.se");
  return [user.age, user2.shoeSize];
}

function* getTwoUsers(id1: string, id2: string) {
  const u1 = yield* Y(getUser(id1));
  const u2 = yield* Y(getUser(id2));
  return [u1, u2];
}

export async function main() {
  const result = await runScript(userAge());
  console.log(result);
}

export async function runScript(generator: Generator<EffectRequest<unknown>>) {
  let result = generator.next();
  while (!result.done) {
    try {
      const effectResult = await effectToPromise(result.value);
      result = generator.next(effectResult);
    } catch (e) {
      generator.throw(e);
    }
  }
}
