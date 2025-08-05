"use strict";

const { lazy } = require("../main");
const assert = require("node:assert");
const { describe, it } = require("node:test");
const timers = require("node:timers/promises");

const count = (fn) => {
  const inner = () => {
    inner.counter++;
    return fn();
  };
  inner.counter = 0;
  return inner;
};

describe("const", () => {
  it("plain", () => {
    const actual = { a: 1 };
    const factory = count(() => actual);
    const get = lazy(factory);
    const expected = get();
    (get(), get(), get());
    assert.deepStrictEqual(expected, actual);
    assert.deepStrictEqual(factory.counter, 1);
  });
});

describe("timeout", async () => {
  const actual = { a: 1 };
  const factory = count(() => actual);
  const get = lazy(factory, { timeout: 1000 });
  const data = get();
  assert.deepStrictEqual(data, actual);
  await timers.setTimeout(1500);
  const data2 = get();
  assert.deepStrictEqual(data2, actual);
  assert.deepStrictEqual(factory.counter, 2);
});

describe("interval/dispose", async () => {
  const actual = { a: 1 };
  const factory = count(() => actual);
  const get = lazy(factory, { interval: 500 });
  const data = get();
  assert.deepStrictEqual(data, actual);
  await timers.setTimeout(750);
  const data2 = get();
  assert.deepStrictEqual(data2, actual);
  await timers.setTimeout(750);
  const data3 = get();
  assert.deepStrictEqual(data3, actual);
  assert.deepStrictEqual(factory.counter, 3);
  get[Symbol.dispose]();
});

describe("node 24.x using", async () => {
  const actual = { a: 1 };
  const factory = count(() => actual);
  using get = lazy(factory, { interval: 500 });
  const data = get();
  assert.deepStrictEqual(data, actual);
  await timers.setTimeout(750);
  const data2 = get();
  assert.deepStrictEqual(data2, actual);
  await timers.setTimeout(750);
  const data3 = get();
  assert.deepStrictEqual(data3, actual);
  assert.deepStrictEqual(factory.counter, 3);
});