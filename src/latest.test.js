const latest = require('./latest');
const reasons = require('./reasons');
const createWaiter = require('./createWaiter');

describe('latest', () => {
  test('simple', async complete => {
    const successCallback1 = jest.fn();
    const successCallback2 = jest.fn();
    const successCallback3 = jest.fn();
    const errorCallback3 = jest.fn();

    latest(()=> createWaiter(300), 'PROMISE_CAT')
    .then(successCallback1)
    .catch(err=>{
      expect(err).toBe(reasons.CANCELED);
    });
    
    latest(()=> createWaiter(500), 'PROMISE_CAT')
    .then(successCallback2)
    .catch(err=>{
      expect(err).toBe(reasons.CANCELED);
    });
    
    await latest(()=> createWaiter(501), 'PROMISE_CAT')
    .then(successCallback3)
    .catch(errorCallback3);

    expect(successCallback1.mock.calls.length).toBe(0);
    expect(successCallback2.mock.calls.length).toBe(1);
    expect(successCallback3.mock.calls.length).toBe(1);
    complete();

  })
})
