import { EffectRequest } from "../shared/effect-descriptors";

export type ContinueWithEffect<TEffectResponse> = {
  __continuation: true;
  effect: EffectRequest<TEffectResponse>;
  next: ContinueFn<TEffectResponse>;
};

export function ContinueWithEffect<TEffectResponse>(
  effect: EffectRequest<TEffectResponse>,
  next: ContinueFn<TEffectResponse>
): ContinueWithEffect<TEffectResponse> {
  return { __continuation: true, effect, next };
}

export type ContinueFn<TMyResponse> = (effectResult: TMyResponse) => unknown;
