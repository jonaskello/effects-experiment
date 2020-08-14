// https://jrsinclair.com/articles/2018/how-to-deal-with-dirty-side-effects-in-your-pure-functional-javascript/

// fZero :: () -> Number
function fZero(): number {
  console.log("Launching nuclear missiles");
  // Code to launch nuclear missiles goes here
  return 0;
}

// fIncrement :: (() -> Number) -> (() -> Number)
function fIncrement(f: () => number): () => number {
  return () => f() + 1;
}

fIncrement(fZero);
// ￩ [Function]

type Effect<T, TArg = undefined> = {
  map: <TMapped>(g: (x: T) => TMapped) => Effect<TMapped, TArg>;
  runEffects: (x: TArg) => T;
  join: (x: TArg) => T;
  chain: <TMapped>(g: (x: T) => TMapped, x: TArg) => TMapped;
  ap: <TMapped>(
    eff: Effect<(x: T) => TMapped, TArg>,
    x: TArg
  ) => Effect<TMapped, TArg>;
};

// Effect :: Function -> Effect
function Effect<T, TArg = undefined>(f: (x: TArg) => T): Effect<T, TArg> {
  return {
    map(g) {
      return Effect((x) => g(f(x)));
    },
    runEffects(x) {
      return f(x);
    },
    join(x) {
      return f(x);
    },
    chain(g, x) {
      return Effect(f).map(g).join(x);
    },
    ap(eff, x) {
      // If someone calls ap, we assume eff has a function inside it (rather than a value).
      // We'll use map to go inside off, and access that function (we'll call it 'g')
      // Once we've got g, we apply the value inside off f() to it
      return eff.map((g) => g(f(x)));
    },
  };
}

// of :: a -> Effect a
Effect.of = function of<T>(val: T) {
  return Effect<T>(() => val);
};

//
const zero = Effect(fZero);
const increment = (x: number) => x + 1; // A plain ol' regular function.
const one = zero.map(increment);
one.runEffects(undefined);

//
const padWithZeros = (x: number) => `000${x}`; // A plain ol' regular function.
const padded = zero.map(padWithZeros);
one.runEffects(undefined);

//
const double = (x: number) => x * 2;
const cube = (x: number) => Math.pow(x, 3);
const eight = Effect(fZero).map(increment).map(double).map(cube);
eight.runEffects(undefined);

//
const incDoubleCube = (x: number) => cube(double(increment(x)));
// If we're using a library like Ramda or lodash/fp we could also write:
// const incDoubleCube = compose(cube, double, increment);
const eightAgain = Effect(fZero).map(incDoubleCube);

//
window.myAppConf = {
  selectors: {
    "user-bio": ".userbio",
    "article-list": "#articles",
    "user-name": ".userfullname",
  },
  templates: {
    greet: "Pleased to meet you, {name}",
    notify: "You have {n} alerts",
  },
};
interface Window {
  myAppConf: {
    selectors: { [key: string]: string };
    templates: { [key: string]: string };
  };
}

const win = Effect.of(window);
const userBioLocator = win.map((win) => win.myAppConf.selectors["user-bio"]);

//
// $ :: String -> Effect DOMElement
function $(selector: string) {
  return Effect.of(document.querySelector(selector));
}

const innerHTML = userBioLocator.map((eff: any) =>
  eff.map((domEl: any) => domEl.innerHTML)
);

//
const userBioHTML = Effect.of(window)
  .map((x) => x.myAppConf.selectors["user-bio"])
  .map($)
  .join(undefined)
  .map((x) => x && x.innerHTML);

//

// tpl :: String -> Object -> String
const tpl = (pattern: string) => (data: { [key: string]: string }): string => {
  return Object.keys(data).reduce((str, key) =>
    str.replace(new RegExp(`{${key}}`, data[key]), pattern)
  );
};

//
// const win = Effect.of(window);
const nameData = win
  .map((w) => w.myAppConf.selectors["user-name"])
  .chain($, undefined)
  .map((el) => (el ? el.innerHTML : ""))
  .map((str) => ({ name: str }));
// ￩ Effect({name: 'Mr. Hatter'});

const pattern = win.map((w) => w.myAppConf.templates["greeting"]);
// ￩ Effect('Pleased to meet you, {name}');

//
const patternEffect = pattern.map(tpl);

//
const greeting = nameData.ap(pattern.map(tpl), undefined);
// ￩ Effect('Pleased to meet you, Mr Hatter')

//
// type Applicative<T> = {
//   ap: <TMapped>(eff: Mappable<(x: T) => TMapped>) => Applicative<TMapped>;
// };
// type Mappable<T> = {
//   map: <TMapped>(g: (x: T) => TMapped) => Mappable<TMapped>;
// };
// // liftA2 :: (a -> b -> c) -> (Applicative a -> Applicative b -> Applicative c)
// const liftA2 = <TA, TB, TC>(f: any) => (x: Mappable<TB>) => (
//   y: Applicative<TC>
// ) => {
//   return y.ap(x.map(f));
//   // We could also write:
//   //  return x.map(f).chain(g => y.map(g));
// };

// type Applicative<T, TArg = undefined> = {
//   ap: <TMapped>(
//     eff: Mappable<(x: T) => TMapped, TArg>,
//     x: TArg
//   ) => Applicative<TMapped, TArg>;
// };

// type Mappable<T, TArg = undefined> = {
//   map: <TMapped>(g: (x: T) => TMapped) => Mappable<TMapped, TArg>;
// };

const liftA2 = <TFrom, TTo>(f: (x: TFrom) => (x: TTo) => TFrom) => (
  x: Effect<TFrom>
) => (y: Effect<TTo>) => {
  return y.ap(x.map(f), undefined);
  // We could also write:
  //  return x.map(f).chain(g => y.map(g));
};

//
const win2 = Effect.of(window);
const user = win
  .map((w) => w.myAppConf.selectors["user-name"])
  .chain($, undefined)
  .map((el) => (el ? el.innerHTML : ""))
  .map((str) => ({ name: str }));

const pattern2 = win.map((w) => w.myAppConf.templates["greeting"]);

const greeting2 = liftA2(tpl)(pattern)(user);
// ￩ Effect('Pleased to meet you, Mr Hatter')
