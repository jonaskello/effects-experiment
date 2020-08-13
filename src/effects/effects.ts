// Fake data
export type Order = { orderId: string };
export type OrderRow = { orderId: string; rowId: string };

type BaseEffect<TReturn> = { type: string };

// Effects

export interface GetOrdersEffect2 extends BaseEffect<string> {
  type: "GetOrdersEffect";
  customerId: string;
}

export type GetOrdersEffect = { type: "GetOrdersEffect"; customerId: string };
export type GetOrderRowsEffect = {
  type: "GetOrderRowsEffect";
  orderId: string;
};

// Effect creators
export function getOrdersEffect(customerId: string): GetOrdersEffect {
  return { type: "GetOrdersEffect", customerId };
}

export function getOrderRowsEffect(orderId: string): GetOrderRowsEffect {
  return { type: "GetOrderRowsEffect", orderId };
}
