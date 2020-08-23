import { State } from "@algebraic-effects/effects";
import { call, sleep } from "@algebraic-effects/core/generic";

const countdown = function* () {
  const count = yield State.get();

  if (count > 0) {
    yield State.set(count - 1); // Decrement count
    yield sleep(1000); // Add a delay of 1 second
    yield call(countdown); // Recursively call the program again.
  }
};

State.of(10)(countdown).fork(
  () => {},
  () => alert("HAPPY NEW YEAR!!!!")
);
