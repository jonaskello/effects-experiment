// import {
//   GetOrdersEffect,
//   GetOrderRowsEffect,
//   Order,
//   OrderRow,
//   getOrdersEffect,
//   getOrderRowsEffect,
// } from "../effects/effects";

// export type EffectFn = <TReturn>(effect: Effect<TReturn>) => Promise<TReturn>;

// export type Effect<TReturn> = GetOrdersEffect | GetOrderRowsEffect;

// export function handleEffect<TReturn>(
//   effect: Effect<TReturn>
// ): Promise<TReturn> {
//   switch (effect.type) {
//     case "GetOrdersEffect":
//       return getOrdersEffectHandler(effect) as Promise<any>;
//     case "GetOrderRowsEffect":
//       return getOrderRowsEffectHandler(effect) as Promise<any>;
//     default:
//       const x: never = effect;
//       throw new Error("Invalid type");
//   }
// }

// async function getOrdersEffectHandler(
//   effect: GetOrdersEffect
// ): Promise<ReadonlyArray<Order>> {
//   return [];
// }

// async function getOrderRowsEffectHandler(
//   effect: GetOrderRowsEffect
// ): Promise<ReadonlyArray<OrderRow>> {
//   return [];
// }

// type ScriptFn = (doEffect: EffectFn) => void;

// function runScript(scriptFn: ScriptFn) {
//   theScript((eff) => handleEffect(eff));
// }

// async function theScript(doEffect: EffectFn): Promise<string> {
//   // Do some stuff
//   const orders = await doEffect(getOrdersEffect("1"));
//   for (const order of orders) {
//     const row = await doEffect(getOrderRowsEffect(order.orderId));
//     console.log(row);
//   }
//   return "";
// }
