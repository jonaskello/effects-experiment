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

type DoEffectFn = <TResponse>(
  effReq: EffectRequest<TResponse>
) => Promise<TResponse>;
type ScriptFn<TReturn> = (doEffect: DoEffectFn) => Promise<TReturn>;

export async function runScript<TReturn>(script: ScriptFn<TReturn>) {
  const result = await script(handleEffectRequest);
  return result;
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

export async function userAge(doEffect: DoEffectFn) {
  // inferred type is correct.
  const user = await doEffect(getUser("1"));
  const user2 = await doEffect(getUser2("1"));
  return [user.age, user2.age];
}

export async function main() {
  const scriptResult = await runScript(userAge);
  console.log(scriptResult);
}
