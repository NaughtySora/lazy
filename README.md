## Lazy loading

### Types

`interface Options {`\
  `timeout?: number;`\
  `interval?: number;`\
`}`

`type Factory = (...args: any[]) => any;`\
`type LazyFn = (factory: Factory, options?: Options) => void;`\
`type LazyAPI = { reset(): void, [Symbol.dispose](): void };`\
`type Lazy = LazyFn & LazyAPI;`


```js
  const factory = require.bind(null, "./module.js");
  const getModule = lazy(factory, { interval: 1000 });
  const module = getModule();
  getData[Symbol.dispose](); // timer and cache are disposed

  const factory2 = () => ({data: 42, text: "hello"});
  const getData = lazy(factory2);
  const data = getData();
  getData.reset(); // reset cache
  const data2 = getData();
  
  {
    // node 24.x
    const factory3 = () => ({data: 42, text: "hello"});
    using getData = lazy(factory2);
    const data = getData();
  } // cache is disposed here
```
