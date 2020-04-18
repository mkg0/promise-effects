import observePromise from './observePromise'

describe('observedPromise', () => {
  test('wait should wait for given time and resolve properly', async () => {
    jest.useFakeTimers()
    const promise1 = new Promise<string>(resolve => setTimeout(() => resolve('OK'), 100))
    const observed = observePromise(promise1)
    await jest.advanceTimersByTime(0)
    expect(observed.isPending()).toBe(true)
    expect(observed.status).toBe('PENDING')
    await jest.advanceTimersByTime(99)
    expect(observed.isPending()).toBe(true)
    expect(observed.isFulfilled()).toBe(false)
    expect(observed.isRejected()).toBe(false)
    expect(observed.status).toBe('PENDING')
    await jest.advanceTimersByTime(101)
    expect(observed.isPending()).toBe(false)
    expect(observed.isFulfilled()).toBe(true)
    expect(observed.isRejected()).toBe(false)
    expect(observed.status).toBe('FULFILLED')
  }, 200)

  test('wait should wait for given time and rejects properly', async () => {
    jest.useFakeTimers()
    const promise1 = new Promise<string>((_, reject) => setTimeout(() => reject('REJECT'), 100))
    const observed = observePromise(promise1)
    await jest.advanceTimersByTime(0)
    expect(observed.isPending()).toBe(true)
    expect(observed.status).toBe('PENDING')
    await jest.advanceTimersByTime(99)
    expect(observed.isPending()).toBe(true)
    expect(observed.isFulfilled()).toBe(false)
    expect(observed.isRejected()).toBe(false)
    expect(observed.status).toBe('PENDING')
    await jest.advanceTimersByTime(101)
    expect(observed.isPending()).toBe(false)
    expect(observed.isFulfilled()).toBe(false)
    expect(observed.isRejected()).toBe(true)
    expect(observed.status).toBe('REJECTED')
    observed.catch(() => null)
  }, 200)

  test('wait should return the correct fulfill value', async () => {
    jest.useFakeTimers()
    const promise1 = new Promise<string>(resolve => setTimeout(() => resolve('OK'), 100))
    await jest.advanceTimersByTime(101)
    observePromise(promise1).then(result => {
      expect(result).toBe('OK')
    })
  }, 200)

  test('rejection should work properly', async () => {
    jest.useFakeTimers()
    const promise1 = new Promise<string>((_, reject) => setTimeout(() => reject('REJECT'), 100))
    await jest.advanceTimersByTime(101)
    observePromise(promise1).catch(error => {
      expect(error).toBe('REJECT')
    })
  }, 200)
})
