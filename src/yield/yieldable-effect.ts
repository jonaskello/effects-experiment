import { getUser, EffectRequest, getUser2 } from "../shared/effect-descriptors";

function makeTypesafeYielder<Produce, Send>(
  _psudoCallSignature: (y: Produce) => Send
) {
  function* yielder(arg: Produce): Generator<Produce, Send, Send> {
    return yield arg;
  }
  return yielder;
}
type Y = <TResponse>(p: EffectRequest<TResponse>) => TResponse;
const Y = makeTypesafeYielder({} as Y);

export async function runScript(generator: Generator<EffectRequest<unknown>>) {
  let result = generator.next();
  while (!result.done) {
    try {
      const effectResult = await handleEffectRequest(result.value);
      result = generator.next(effectResult);
    } catch (e) {
      generator.throw(e);
    }
  }
}

async function handleEffectRequest<TResponse>(
  effReq: EffectRequest<TResponse>
): Promise<TResponse> {
  const effect = effReq.effect;
  switch (effect.type) {
    case "UserEffect":
      return Promise.resolve({ id: "", age: 0 } as any);
    case "User2Effect":
      return Promise.resolve({} as any);
    default:
      const x: never = effect;
      throw new Error("Invalid type");
  }
}

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

function* getTwoUsers(id1: string, id2: string) {
  const u1 = yield* Y(getUser(id1));
  const u2 = yield* Y(getUser(id2));
  return [u1, u2];
}

export async function main() {
  const result = await runScript(userAge());
  console.log(result);
}
