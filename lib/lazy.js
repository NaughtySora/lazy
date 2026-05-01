'use strict';

const collection = new Map();

const set = (key, fn, ...args) => {
  if (collection.has(key)) del(key);
  const factory = fn.bind(null, ...args);
  collection.set(key, {
    factory, value: null,
    tty: null, timer: null,
  });
  return set;
};

const get = (key) => {
  const entry = collection.get(key);
  if (entry === undefined) return;
  return entry.value ??= entry.factory();
};

const tty = (key, value) => {
  const entry = collection.get(key);
  if (entry === undefined) return tty;
  if (typeof entry.tty === "number") {
    clearTimeout(entry.timer);
  }
  entry.timer = setTimeout(() => {
    entry.value = null;
    if (entry.timer) clearTimeout(entry.timer);
    entry.timer = null;
  }, entry.tty = value).unref();
  return tty;
};

const clear = () => {
  for (const value of collection.values()) {
    if (value.timer) clearTimeout(value.timer);
  }
  collection.clear();
};

const del = (key) => {
  const entry = collection.get(key);
  if (entry === undefined) return false;
  if (entry.timer) clearTimeout(entry.timer);
  collection.delete(key);
  return true;
};

const has = key => collection.has(key);

module.exports = {
  set, get, tty, clear,
  delete: del, has,
  get size() { return collection.size },
};
