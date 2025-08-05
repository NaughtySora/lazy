interface Options {
  timeout?: number;
  interval?: number;
}

type Factory = (...args: any[]) => any;
type LazyFn = (factory: Factory, options?: Options) => void;
type LazyAPI = { reset(): void, [Symbol.dispose](): void };
type Lazy = LazyFn & LazyAPI;

export const lazy: Lazy;