# Promise Effects

### latest

It prevents/breaks previous promise.

```js
import { latest, createDelay, reasons } from 'promise-effects';

function() {
  for(let i=0; i<3;i++) {
    latest((() => createDelay(2000))
      .then( err => console.log('resolved!'))
      .catch(err => {
        if(err === reasons.canceled) {
          console.info('canceled regarding to the new request');
          return;
        }
        console.error(err.message);
      })
  }
  /*
    prints:
    > canceled regarding to the new request
    > canceled regarding to the new request
    > resolved!
  */
}
```
#### createLatest

```js
import { createLatest, createDelay } from 'promise-effects';

const latestLog = createLatest();
const latestError = createLatest();
async function(){
  const printConsole = (value, type='log') => createDelay(2000).then(()=> console[type](value));
  latestLog(() => printConsole('log1'));
  latestLog(printConsole('log2'));
  latestError(printConsole('error', 'error'));
  printConsole('effectless output!');
  latestLog(printConsole('log3'));
  // prints:
  // error
  // efectless output!
  // log3
}

```

### poll

```js

import { poll, createDelay } from 'promise-effects';
async function(){

  poll(createDelay(2000), {interval: 1000, timeout: 60000, onTick: fn(), evaluateResult: fn()})
  .then()
  .catch()
}

##### Options


onTick    
timeout         miliseconds as number
interval        Array or number
evaluateResult



```

### retry

### latest