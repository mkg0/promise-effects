import wait from '../wait'
import getDelayInMs from './getDelayInMs'
import { defaultDelay, IRetryOptions, IAttempt } from './constant'

export default function retryPromise<T extends (...args: any[]) => any>(
  promiseCreator: T,
  options?: Partial<IRetryOptions>
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const { delay = defaultDelay, retry = 10, attemptNumber = 1 } = options || {}
    return promiseCreator(...args).catch((error: Error) => {
      const attempt: IAttempt = {
        attemptNumber,
        remainingTries: retry,
        error,
      }
      const shouldRetry = options.shouldRetry ? options.shouldRetry(attempt) : true
      if (retry <= 0 || !shouldRetry) {
        return Promise.reject(error)
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
