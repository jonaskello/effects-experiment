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

type User = { id: string; age: number };
type User2 = { id: string; age: number; shoeSize: string };

type UserEffect = { type: "UserEffect"; id: string };
type User2Effect = { type: "User2Effect"; id: string };

function getUser(id: string): EffectRequest<User> {
  return { effect: { type: "UserEffect", id } };
}
function getUser2(id: string): EffectRequest<User2> {
  return { effect: { type: "User2Effect", id } };
}

type Effect = UserEffect | User2Effect;

type EffectRequest<TResponse> = { effect: Effect };

export async function runScript(generator: Generator<EffectRequest<unknown>>) {
  let result = generator.next();
  while (!result.done) {
    const effectResult = await handleEffectRequest(result.value);
    result = generator.next(effectResult);
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
  return [user.age, user2.age];
}

export async function main() {
  const result = await runScript(userAge());
  console.log(result);
}
