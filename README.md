Promise Effects
=================================

Promise effects over promises for advanced use cases or test purposes.

## Install
```sh
npm install promise-effects
```

### timeout

You don't need an exclusive timeout function for timeout. Use `wait` with [ES Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) instead.


```js
  // fail in 1 sec
  Promise.race([
    fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=1200ms').then(res=> resp.json()),
    wait(1000).then(()=> Promise.reject('Timeout!'))
  ])
  // > Uncaught (in promise) Timeout!
```

```js
  // will mock response if the first request doesn't resolve in 1 sec
  const result = await Promise.race([
    fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=1200ms').then(res=> resp.json()),
    wait(1000).then(()=> ({ hello: 'mock' }))
  ])
  console.log(result)
  // > { hello: 'mock' }
```

## Changelog

All notable changes to this project will be documented in the [changelog file](https://github.com/mkg0/promise-effects/blob/master/CHANGELOG.md).
