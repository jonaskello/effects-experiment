function makeTypesafeYielder<Produce, Send>(
  _psudoCallSignature: (y: Produce) => Send
) {
  function* yielder(arg: Produce): Generator<Produce, Send, Send> {
    return yield arg;
  }
  return yielder;
}
type Y = <TResponse, TRequest extends Effect>(
  p: EffectRequest<TResponse, TRequest>
) => TResponse;
const Y = makeTypesafeYielder({} as Y);

type User = { id: string; age: number };
type User2 = { id: string; age: number; shoeSize: string };

type UserEffect = { type: "UserEffect"; id: string };
type User2Effect = { type: "User2Effect"; userName: string };

function getUser(id: string): EffectRequest<User, UserEffect> {
  return { effect: { type: "UserEffect", id } };
}
function getUser2(userName: string): EffectRequest<User2, User2Effect> {
  return { effect: { type: "User2Effect", userName } };
}

type Effect = UserEffect | User2Effect;

type EffectRequest<TResponse, TRequest extends Effect> = {
  effect: TRequest;
  response?: TResponse;
};

export async function runScript(
  generator: Generator<EffectRequest<unknown, any>>
) {
  const result = generator.next();
  while (!result.done) {
    const effectResult = await handleEffectRequest(result.value);
    generator.next(effectResult);
  }
}

async function handleEffectRequest<TResponse, TRequest extends Effect>(
  effReq: EffectRequest<TResponse, TRequest>
): Promise<TResponse> {
  const effect = effReq.effect;
  switch (effReq.effect.type) {
    case "UserEffect": {
      const z = effReq.effect.id;
      return "";
    }
    case "User2Effect": {
      const z = effReq.effect.userName;
      return "";
    }
    default:
      const x: never = effect;
      throw new Error("sdfad");
  }
  switch (effect.type) {
    case "UserEffect":
      const olle = effect.type;
      return "";
    // return Promise.resolve({ id: "", age: 0 } as any);
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
