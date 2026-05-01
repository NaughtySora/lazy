## Lazy loading

```js
  lazy.set('key', (a) => ({test: 123 + a}), 377);
  lazy.tty('key', 5000);
  const value = lazy.get('key');
  const value2 = lazy.get('key');
  console.log(value === value2);
  lazy.delete('key');
  lazy.clear();
  const value2 = lazy.get('key');
  console.log(value === undefined);
```
