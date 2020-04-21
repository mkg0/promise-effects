import retryPromise from './retryPromise'
import { ShouldRetry, DelayFn } from './constant'
import observePromise from '../observePromise'
import wait from '../wait'

function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve))
}

beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()
  jest.clearAllTimers()
})

describe('retryPromise', () => {
  const onReconnecting = jest.fn()
  const promiseCons = jest.fn()
  function createRejectingPromise(
    times = 0
  ): (resolves: string, rejects?: string) => Promise<string> {
    let rejected = 0
    return (resolves = 'OK', rejects?: string): Promise<string> => {
      promiseCons()
      // console.log('promise', times, times)
      if (rejected === times) return Promise.resolve(resolves)
      rejected++
      return Promise.reject(rejects)
    }
  }

  test('retryPromise should resolve if it resolves directly', () => {
    const tryResolveProgressively = retryPromise(createRejectingPromise(0), { onReconnecting })
    return tryResolveProgressively('OK').then(result => {
      expect(result).toBe('OK')
      expect(onReconnecting).not.toBeCalled()
    })
  })

  test('should retry if promise fails', async () => {
    const tryResolveProgressively = retryPromise(createRejectingPromise(4), {
      onReconnecting,
      delay: 100,
    })
    const promise = tryResolveProgressively('OK')
    await flushPromises()
    await jest.advanceTimersByTime(100)
    await flushPromises()
    await jest.advanceTimersByTime(100)
    await flushPromises()
    await jest.advanceTimersByTime(100)
    await flushPromises()
    await jest.advanceTimersByTime(100)
    return promise.then(result => {
      expect(result).toBe('OK')
      expect(onReconnecting).toBeCalledTimes(4)
    })
  })

  test('should wait the given time long', async () => {
    const tryResolveProgressively = retryPromise(createRejectingPromise(1), {
      onReconnecting,
      delay: 100,
    })
    const promise = observePromise(tryResolveProgressively('OK'))
    await flushPromises()
    await jest.advanceTimersByTime(99)
    expect(promise.isPending()).toBe(true)
    await flushPromises()
    await jest.advanceTimersByTime(1)
    await flushPromises()
    expect(onReconnecting).toHaveBeenCalledTimes(1)
    expect(promiseCons).toHaveBeenCalledTimes(2)
    expect(promise.isFulfilled()).toBe(true)
    expect(setTimeout).toBeCalledWith(expect.any(Function), 100)
  })

  test('should reject with correct value', async () => {
    const tryResolveProgressively = retryPromise(createRejectingPromise(Infinity), { retry: 3 })
    const promise = tryResolveProgressively('OK', 'REJECT')
    await flushPromises()
    await jest.runAllTimers()
    await flushPromises()
    await jest.runAllTimers()
    await flushPromises()
    await jest.runAllTimers()
    return promise.catch(result => {
      expect(result).toBe('REJECT')
    })
  })

  test('should not retry if shouldRetry false', async () => {
    const shouldRetry: ShouldRetry = jest.fn(({ attemptNumber, error, remainingTries }) => {
      return attemptNumber < 2
    })
    const tryResolveProgressively = retryPromise(createRejectingPromise(Infinity), {
      onReconnecting,
      shouldRetry,
    })
    const promise = tryResolveProgressively('OK', 'REJECT')

    await flushPromises()
    await jest.runAllTimers()

    return promise.catch(result => {
      expect(result).toBe('REJECT')
      expect(onReconnecting).toHaveBeenCalledTimes(1)
      expect(promiseCons).toHaveBeenCalledTimes(2)
      expect(shouldRetry).toHaveBeenCalledTimes(2)
    })
  })

  test('should wait with advance delay interface', async () => {
    const tryResolveProgressively = retryPromise(createRejectingPromise(5), {
      onReconnecting,
      delay: {
        delay: 1000,
        factor: 1.2,
      },
    })
    const promise = observePromise(tryResolveProgressively('OK', 'REJECT'))

    await flushPromises()
    await jest.advanceTimersByTime(1000)
    await flushPromises()
    await jest.advanceTimersByTime(1200)
    await flushPromises()
    await jest.advanceTimersByTime(1440)
    await flushPromises()
    await jest.advanceTimersByTime(1728)
    await flushPromises()

    expect(promise.isPending()).toBe(true)
    await jest.advanceTimersByTime(2074)
    await flushPromises()
    expect(promise.isPending()).toBe(false)
    expect(await promise).toBe('OK')
    expect(onReconnecting).toHaveBeenCalledTimes(5)
    expect(promiseCons).toHaveBeenCalledTimes(6)
  })

  test('should consider min/max when calculates advance delay', async () => {
    const tryResolveProgressively = retryPromise(createRejectingPromise(3), {
      onReconnecting,
      delay: {
        delay: 1000,
        factor: 2,
        min: 1500,
        max: 3000,
      },
    })
    const promise = observePromise(tryResolveProgressively('OK', 'REJECT'))

    await flushPromises()
    await jest.advanceTimersByTime(1500)
    await flushPromises()
    await jest.advanceTimersByTime(2000)
    await flushPromises()
    expect(promise.isFulfilled()).toBe(false)
    await jest.advanceTimersByTime(3000)
    expect(await promise).toBe('OK')
  })

  test('should wait the given ms when delay is fn', async () => {
    const delayFn: DelayFn = jest.fn(attempt => {
      return 100 * attempt.attemptNumber
    })
    const tryResolveProgressively = retryPromise(createRejectingPromise(3), {
      onReconnecting,
      delay: delayFn,
    })
    const promise = observePromise(tryResolveProgressively('OK', 'REJECT'))
    await flushPromises()
    await jest.advanceTimersByTime(100)
    expect(delayFn).toHaveBeenLastCalledWith({
      error: 'REJECT',
      remainingTries: 10,
      attemptNumber: 1,
    })
    await flushPromises()
    await jest.advanceTimersByTime(200)
    expect(delayFn).toHaveBeenLastCalledWith({
      error: 'REJECT',
      remainingTries: 9,
      attemptNumber: 2,
    })
    await flushPromises()
    await jest.advanceTimersByTime(300)
    expect(delayFn).toHaveBeenLastCalledWith({
      error: 'REJECT',
      remainingTries: 8,
      attemptNumber: 3,
    })

    expect(await promise).toBe('OK')
    expect(delayFn).toBeCalledTimes(3)
  })

  test('should wait until promise resolves when delay fn returns a promise ', async () => {
    const delayFn: DelayFn = jest.fn(attempt => {
      return wait(100 * attempt.attemptNumber).then(() =>
        attempt.attemptNumber === 2 ? undefined : attempt.attemptNumber
      )
    })
    const tryResolveProgressively = retryPromise(createRejectingPromise(3), {
      onReconnecting,
      delay: delayFn,
    })
    const promise = observePromise(tryResolveProgressively('OK', 'REJECT'))
    await flushPromises()
    await jest.advanceTimersByTime(100)
    await flushPromises()
    await jest.advanceTimersByTime(1)
    await flushPromises()
    await jest.advanceTimersByTime(200)
    await flushPromises()
    await jest.advanceTimersByTime(0)
    await flushPromises()
    await jest.advanceTimersByTime(300)
    await flushPromises()
    expect(promise.isPending()).toBe(true)
    await jest.advanceTimersByTime(3)

    expect(await promise).toBe('OK')
    expect(delayFn).toBeCalledTimes(3)
  })
})
