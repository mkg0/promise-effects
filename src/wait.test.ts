import wait from './wait'
import observePromise from './observePromise'

describe('wait', () => {
  test('wait should resolve after the given time', async () => {
    jest.useFakeTimers()
    const waiter = observePromise(wait(100))
    expect(waiter.status).toBe('PENDING')
    await jest.advanceTimersByTime(100)
    expect(waiter.status).toBe('FULFILLED')
  }, 700)

  test('wait not resolve until the given time', async () => {
    jest.useFakeTimers()
    const waiter = observePromise(wait(100))
    await jest.advanceTimersByTime(50)
    expect(waiter.status).toBe('PENDING')
    await jest.advanceTimersByTime(20)
    expect(waiter.status).toBe('PENDING')
    await jest.advanceTimersByTime(10)
    expect(waiter.status).toBe('PENDING')
    await jest.advanceTimersByTime(10)
    expect(waiter.status).toBe('PENDING')
    await jest.advanceTimersByTime(9)
    expect(waiter.status).toBe('PENDING')
  }, 700)
})
