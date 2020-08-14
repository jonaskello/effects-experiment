# Effects Experiment

Experiment with side-effects in typscript

## Yieldable effect

Uses generators and the fact that `yield` in javascript is an expression that returns a value.
Effects are encoded as data objects that describes the desired effect.
The function yields the effect descriptor objects and the infrastruture code responsible for executing the function turns the yielded effect descriptors into promises that it then awaits.

### Pros

- The effects the function can do is constrained to effects approved by the code that runs the function. It is very hard to cheat by doing an async effect in another way than yielding it.
- Easy for the infrastructure code to run the function in steps (eg. for testing) with iterator.next().
- Generators can be cancelled at any step but an async function cannot (minor advantage?).

### Cons

- Unfamiliar syntax to most developers.
- Cannot infer the type of yield expression based on yielded value without workaround using `yield*`.
- It is easy to cheat with an sync effect like `console.log()`.

### Notes

This seems related to algebraic-effects

https://github.com/phenax/algebraic-effects
http://www.cse.chalmers.se/~rjmh/tfp/proceedings/TFP_2020_paper_10.pdf

Generator: infer the type of yield expression based on yielded value

https://github.com/microsoft/TypeScript/issues/32523

Work-around for infer the type of yield expression based on yielded value:

https://github.com/microsoft/TypeScript/issues/36855#issuecomment-588286256
https://www.typescriptlang.org/play?ssl=11&ssc=2&pln=1&pc=1#code/PQKhFgCgAIWhjATgUwIYBdkGdqulgSwFsAHAG2WgHdFUSTlFoAzAVwDt50CB7d6dAAsM0ZOyysUOdAE8GWVM2SzofAYMoyCyMgBN86DMiJj0LHkzIEARrUTasAOiixoAZR7UN-GT1bU-PWhdTyweEyECdgBzaCsAa0oAA3g+LDMAD2gAXmgtHX0AN1QyJNx2fSFKWQZVZmgs3WQGCpw1YrJ8cORBHioAGjy-BFR+EJc4JKma7CQCEnQJgTlKAE1tPTcCWNyAHgAVAD4ACg6ALmh9gEpsw-3oYGB8bfZUSUoeevyg5AySKUIamYFiGkhGWGQzhgcFS4jM6wKOWgRFQiX2KwUSgRekYxwA3gBfXA4bG6LbRK4AbgmSzYnG4fDgv1QpAoxyueKW0G5DyeVEoITyG10cFG+gIZjEEiky3kimUMi5PNh6QaSO+IugpNOJSuSwJSymSSWAAESKhaERoCQJCEAMIlMjk17od7Qdg8MysCG6QZYXqsILWSjmrA+4nQJKEiPkspUDQodzbaAEaQaEZkTqEaIut2fdSaYWidjAxDwZD6awyUGWGx2GRQ2DAKB0ri8fgotEY+Wkxi7AAKiB4ulY5cGbjEuhONtY9sdzow7wuxxkF0Hw9HyCuOUO7kn285MB5rYZ7DgGtxFuia6HI-LVwuAHExIwMBYB7fN+PJ9+KrvDzygHQCgrqID4RZXtSR7cga0HAcokjgQUjBQbBMxakiBzTje4SpsgWHbrclxQSq8JIp2yDonKWLCri0aoCSVJQFA6EAKoQkwuR4imugXOk9gxJSuDRMgFzsKwRDBkwBJQU08BkBalAnu20Aieg7G4g+0DrkQeG7BpiCHFBLYcG2jLQN6jAAIIiey0AATyjwpiWjAoJUKwpjgqSICgXCNsqaRehx6rCnAqzHGpBnskxcEgYhFkcY4qAiahUBAA

## Awaitable effect

Very similar to Yieldable effect but uses the more familiar `await` syntax to do the effects.
Effects are encoded as data objects that describes the desired effect.
The function gets passed a doEffects function that accepts an effect descriptor object and returns a Promise that can be awaited.

### Pros

- Familiar syntax to most developers.

### Cons

- You cannot constrain what an async function awaits. It is easy to cheat with an async effect, just call any API that returns Promise (eg. `fetch()`) and then await it.
- You cannot run the function in steps (eg. for testing) unless you keep track of some state in the `doEffect` function.
- It is easy to cheat with an sync effect like `console.log()`.
