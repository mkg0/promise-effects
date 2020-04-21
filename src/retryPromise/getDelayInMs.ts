import { DELAY_ERROR } from '../errors'
import { IAdvanceDelay, DelayFn, IAttempt, defaultDelay } from './constant'

export default async function getDelayInMs(
  delay: number | IAdvanceDelay | DelayFn,
  attempt: IAttempt
): Promise<number> {
  if (!delay) {
    throw DELAY_ERROR
  } else if (typeof delay === 'number') {
    return delay
  } else if (typeof delay !== 'function') {
    const {
      factor,
      delay: delayMs,
      min = defaultDelay.min,
      max = defaultDelay.max,
    } = delay as IAdvanceDelay
    return Math.max(Math.min(delayMs * Math.pow(factor, attempt.attemptNumber - 1), max), min)
  }
  const normalize = (int: number): number => Math.round(Math.max(int, 0))
  const result = (delay as DelayFn)(attempt)
  if ((result as Promise<void>).then) {
    const awaitedResult = await result
    return awaitedResult ? normalize(awaitedResult as number) : 0
  }
  return normalize(result as number)
}
