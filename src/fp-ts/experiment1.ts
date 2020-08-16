import { array } from "fp-ts/Array";
import { task } from "fp-ts/Task";

const tasks = [task.of(1), task.of(2)];
array.sequence(task)(tasks)().then(console.log); // [ 1, 2 ]
