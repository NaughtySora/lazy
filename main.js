'use strict';

const kTimer = Symbol();
const kInstance = Symbol();

function Lazy() {
  this[kInstance];
  this[kTimer] = null;
}

Lazy.prototype.reset = function () {
  this[kInstance] = undefined;
}

Lazy.prototype[Symbol.dispose] = function () {
  const timer = this[kTimer];
  if (timer) {
    timer[Symbol.dispose]();
    this[kTimer] = null;
  }
  this[kInstance] = undefined;
}

function lazy(factory, options) {
  const get = () => get[kInstance] ??= factory();
  const interval = options?.interval;
  const ms = interval ?? options?.timeout;
  if (ms !== undefined && ms > 0) {
    const timer = setTimeout(() => {
      get.reset();
      if (typeof interval === "number" && interval > 0) {
        timer.refresh();
      }
    }, ms);
    Object.assign(get, { [kTimer]: timer });
  }
  Object.setPrototypeOf(get, Lazy.prototype);
  return get;
};

module.exports = { lazy };
