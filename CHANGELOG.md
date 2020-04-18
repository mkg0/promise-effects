# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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