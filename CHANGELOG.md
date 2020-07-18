# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0]
### Added
- add returnt ype promise to `shouldRetry`
### Changed
Better namings:
  - `error` to `reason` in `shouldRetry` func
  - `IAttempt` to `Attempt`
  - `IRetryOptions` to `RetryOptions`
  - `IAdvanceDelay` to `AdvanceDelay`

## [1.0.0]
### Added
- **observePromise**
```js
const observed = observePromise(fetch('http://google.com'))
console.log(observed.isPending()) // > true
console.log(observed.status) // > 'PENDING'
observed.then(result=> {
  console.log(observed.isPending()) // > false
  console.log(observed.status) // > 'FULFILLED'
})
```

- **wait**
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
- **retryPromise**
A high-order function that gives the retry capability to functions that creates promise. 
```js
const repetitiveFetch = retryPromise(fetch, {retry: 3, onReconnecting: ({attemptNumber})=> console.log(`Fetching has failed(${attemptNumber})... Retrying...`)})
repetitiveFetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed')
// > Fetching has failed(1)... Retrying...
// > Fetching has failed(2)... Retrying...
// > Fetching has failed(3)... Retrying...
// > ...
```

### Changed
- Start using "changelog" over "change log" since it's the common usage.
- Start versioning based on the current English version at 0.3.0 to help
translation authors keep things up-to-date.
- Rewrite "What makes unicorns cry?" section.

### Removed
- Section about "changelog" vs "CHANGELOG".

## [1.0.0]

[Unreleased]: https://github.com/mkg0/promise-effects/compare/v1.0.0...HEAD
[0.2.0]: https://github.com/mkg0/promise-effects/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mkg0/promise-effects/releases/tag/v0.1.0
