// Similar to The Elm Architecture

import { User, User2, getUser, getUser2 } from "../shared/effect-descriptors";
import { effectToPromise } from "../shared/effect-to-promise";
import { ContinueWithEffect } from "./continue-with-effect";

export function userAge(userId: string) {
  return ContinueWithEffect(getUser(userId), (user: User) => {
    return ContinueWithEffect(getUser2(user.id), (user2: User2) => {
      return [user.age, user2.shoeSize];
    });
  });
}

export const userAgeExtremeLambda = (userId: string) =>
  ContinueWithEffect(getUser(userId), (user: User) =>
    ContinueWithEffect(getUser2(user.id), (user2: User2) => [
      user.age,
      user2.shoeSize,
    ])
  );

export async function main() {
  const result = await runScript(userAge, ["1"]);
  console.log(result);
}

export async function runScript(fn: Function, args: unknown[]) {
  let result = fn(...args);
  while ((result as any).__continuation) {
    const effResult = await effectToPromise(
      (result as ContinueWithEffect<unknown>).effect
    );
    result = (result as ContinueWithEffect<unknown>).next(effResult);
  }
  return result;
}
