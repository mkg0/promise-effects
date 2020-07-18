import wait from '../wait'
import getDelayInMs from './getDelayInMs'
import { defaultDelay, RetryOptions, Attempt } from './constant'

export default function retryPromise<T extends (...args: any[]) => any>(
  promiseCreator: T,
  options?: Partial<RetryOptions>
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const { delay = defaultDelay, retry = 10, attemptNumber = 1 } = options || {}
    return promiseCreator(...args).catch(async (reason: any) => {
      const attempt: Attempt = {
        attemptNumber,
        remainingTries: retry,
        reason,
      }
      const shouldRetry: boolean = await Promise.resolve(
        options.shouldRetry ? options.shouldRetry(attempt) : true
      )
      if (retry <= 0 || !shouldRetry) {
        return Promise.reject(reason)
      }
      if (options?.onReconnecting) options.onReconnecting(attempt)
      return getDelayInMs(delay, attempt)
        .then(wait)
        .then(() =>
          retryPromise(promiseCreator, {
            ...options,
            retry: retry - 1,
            attemptNumber: attemptNumber + 1,
          })(...args)
        )
    })
  }
}
