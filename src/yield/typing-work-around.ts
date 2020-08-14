import { EffectRequest } from "../shared/effect-descriptors";

function makeTypesafeYielder<Produce, Send>(
  _psudoCallSignature: (y: Produce) => Send
) {
  function* yielder(arg: Produce): Generator<Produce, Send, Send> {
    return yield arg;
  }
  return yielder;
}
export type Y = <TResponse>(p: EffectRequest<TResponse>) => TResponse;
export const Y = makeTypesafeYielder({} as Y);
