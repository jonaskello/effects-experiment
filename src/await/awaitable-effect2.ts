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
type ScriptFn<TReturn> = (
  doEffect: DoEffectFn,
  ...args: unknown[]
) => Promise<TReturn>;

export async function runScript<TReturn>(
  script: ScriptFn<TReturn>,
  args: unknown[]
) {
  const result = await script(handleEffectRequest, ...args);
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
  const moreUsers = await getTwoUsers(doEffect, "1", "2");
  const moreUsers2 = await getTwoUsers(doEffect, "3", "4");
  const user2 = await doEffect(getUser2("1"));
  const result = await fetch("http://www.sunet.se");
  return [user.age, user2.age];
}

async function getTwoUsers(doEffect: DoEffectFn, id1: string, id2: string) {
  const u1 = await doEffect(getUser(id1));
  const u2 = await doEffect(getUser(id2));

  const thenable = {
    then: (onFulfilled: (x: number) => void) => {
      setTimeout(() => onFulfilled(42), 10);
    },
  };

  const olle = await thenable;
  return [u1, u2];
}

export async function main() {
  const scriptResult = await runScript(userAge, []);
  console.log(scriptResult);
}
