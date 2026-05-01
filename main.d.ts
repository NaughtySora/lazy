type Tty = (key: any, value: number) => Tty;
type Set = <F extends (...args: any[]) => any, A extends Parameters<F>>
  (key: any, fn: F, ...args: A) => Set;

interface Lazy {
  set: Set
  get(key: any): any;
  tty: Tty;
  clear(): void;
  del(key: any): boolean;
  has(key: any): boolean;
  size: number;
}

export const lazy: Lazy;
