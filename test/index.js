"use strict";

const { async } = require("naughty-util");
const { lazy } = require("../main");
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const timers = require("node:timers/promises");

const createCount = () => {
  const count = fn => (count.counter++, fn());
  count.counter = 0;
  return count;
};

describe("lazy", () => {
  it("simple", () => {
    const count = createCount();
    const KEY = "abc";
    lazy.set(KEY, () => { })
    (KEY, count, () => ({ a: 1 }));
    const expected = lazy.get(KEY);
    const expected2 = lazy.get(KEY);
    (lazy.get(KEY), lazy.get(KEY), lazy.get(KEY));
    assert.deepEqual(expected, expected2);
    assert.equal(count.counter, 1);
  });

  it("tty", async () => {
    const count = createCount();
    const KEY = "123";
    lazy.set(KEY, count, () => ({ a: Math.random() }));
    lazy.tty(KEY, 500);
    const expected = lazy.get(KEY);
    const expected2 = lazy.get(KEY);
    (lazy.get(KEY), lazy.get(KEY), lazy.get(KEY));
    assert.deepEqual(expected, expected2);
    assert.equal(expected.a, expected2.a);
    assert.equal(count.counter, 1);
    await async.pause(500);
    const expected3 = lazy.get(KEY);
    assert.notDeepEqual(expected3, expected2);
    assert.notEqual(expected3.a, expected2.a);
    assert.equal(count.counter, 2);
    lazy.tty(KEY, 250);
    await async.pause(250);
    const expected4 = lazy.get(KEY);
    assert.notDeepEqual(expected3, expected4);
    assert.notEqual(expected4.a, expected3.a);
    assert.equal(count.counter, 3);

    lazy.tty("smth", 500);
  });

  it('clear', () => {
    lazy.clear();
    assert.equal(lazy.get('abc'), undefined);
    assert.equal(lazy.get('123'), undefined);
    lazy.set('321', () => { });
    lazy.tty('321', 500);
    lazy.clear();
    assert.equal(lazy.get('321'), undefined);

  });

  it('has', () => {
    const KEY = "+";
    lazy.set(KEY, () => { });
    assert.ok(lazy.has(KEY));
    assert.ok(!(lazy.has(KEY + KEY)));
  });

  it('delete', () => {
    const KEY = "-";
    lazy.set(KEY, () => { });
    lazy.tty(KEY, 1234);
    assert.ok(lazy.has(KEY));
    lazy.delete(KEY);
    assert.ok(!lazy.has(KEY));
    assert.ok(!lazy.delete('-=-'));
  });
});

//   const actual = { a: 1 };
//   const factory = count(() => actual);
//   using get = lazy(factory, { interval: 500 });
//   const data = get();
//   assert.deepEqual(data, actual);
//   await timers.setTimeout(750);
//   const data2 = get();
//   assert.deepEqual(data2, actual);
//   await timers.setTimeout(750);
//   const data3 = get();
//   assert.deepEqual(data3, actual);
//   assert.deepEqual(factory.counter, 3);
// });