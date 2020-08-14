export type User = { id: string; age: number };
export type User2 = { id: string; age: number; shoeSize: string };

export type UserEffect = { type: "UserEffect"; id: string };
export type User2Effect = { type: "User2Effect"; id: string };

export function getUser(id: string): EffectRequest<User> {
  return { effect: { type: "UserEffect", id } };
}
export function getUser2(id: string): EffectRequest<User2> {
  return { effect: { type: "User2Effect", id } };
}

export type Effect = UserEffect | User2Effect;

export type EffectRequest<TResponse> = { effect: Effect };
