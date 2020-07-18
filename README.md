Promise Effects
=================================

[![npm](https://img.shields.io/npm/v/promise-effects)](https://www.npmjs.com/package/promise-effects)
[![npm](https://img.shields.io/npm/l/promise-effects)]()

Fully typed promise effects to play with async handlers in a pleasent way.

| Effect                            | Desc                                                  |
|-----------------------------------|-------------------------------------------------------|
| [retryPromise](#retryPromise)     | Converts a promise creator to repetitive              |
| [wait](#wait)                     | Creates a promise to resolve for the given time long. |
| [observePromise](#observePromise) | Creates observable promises from the given promise    |
| [timeout](#timeout)               | Timeout example                                       |
| Polling                           | ⏱ Polling example                                     |
| Latest                            | ⏱                                                     |
| CancelablePromise<T>              | ⏱                                                     |

## Usage

Install package
```sh
npm install promise-effects
```

Import module
```js
import { retryPromise } from 'promise-effects'
// or
import retryPromise from 'promise-effects/retryPromise'
```

## Effects

### **RetryPromise**

It's a high-order function that gives the capabilify of retry to a function that creates promise.

```js
const repetitiveFetch = retryPromise(fetch, {
  retry: 3,
  onReconnecting: ({ attemptNumber }) => console.log(`Fetching has failed(${attemptNumber})... Retrying...`),
})
repetitiveFetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed')
  .then(resp=> resp.json())
  .then(console.log)
  .catch(() => console.log('Failed!'))
// > Fetching has failed(1)... Retrying...
// > Fetching has failed(2)... Retrying...
// > Fetching has failed(3)... Retrying...
// > Failed!
```

#### Options

| Option Name    | Type                                                                                        |
|----------------|---------------------------------------------------------------------------------------------|
| onReconnecting | `fn:({attemptNumber: number,  remainingTries: number,  error: Error})`                      |
| delay          | `number`                                                                                    |
| delay          | `{ delay: number, factor: number, max?: number, min?: number }`                             |
| delay          | `fn: ({attemptNumber: number,  remainingTries: number,  error: Error}) => number | Promise` |
| shouldRetry    | `fn: ({attemptNumber: number,  remainingTries: number,  error: Error}) => booleaan |Promise<boolean>`         |
| retry          | `number`                                                                                    |



### **observePromise**

It wraps promises to observe the status. You can get if the promise `fulfilled`, `rejected` or `pending`. It's beneficial on test purposes. 

```js
const observed = observePromise(fetch('http://google.com'))
console.log(observed.isPending()) // > true
console.log(observed.isRejected()) // > false
console.log(observed.isFulfilled()) // > false
console.log(observed.status) // > 'PENDING'
observed
  .then(result=> {
    console.log(observed.status) // > 'RESOLVED'
    console.log(observed.isFulfilled()) // > true
  })
  .catch(() => {
    console.log(observed.status) // > 'REJECTED'
    console.log(observed.isRejected()) // > true
  })
```

### **wait**

Creates a promise to resolve for the given time long.

```js
const printMessage = (count=0) =>
  Promise.resolve()
    .then(() => console.log(`You will see this message every second(${count})`))
    .then(() => wait(1000).then(() => printMessage(count + 1)))

printMessage()
// > You will see this message every second(0)
// > You will see this message every second(1)
// > You will see this message every second(2)
// > You will see this message every second(3)
// > ...
```


### **timeout**

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
