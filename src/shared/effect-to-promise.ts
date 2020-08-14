import { EffectRequest } from "./effect-descriptors";

export async function effectToPromise<TResponse>(
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
