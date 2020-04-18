export interface ObservedPromise<T> extends Promise<T> {
  isFulfilled: () => boolean
  isPending: () => boolean
  isRejected: () => boolean
  status: 'PENDING' | 'FULFILLED' | 'REJECTED'
}

export default function observePromise<T>(promise: Promise<T>): ObservedPromise<T> {
  let isPending = true
  let isRejected = false
  let isFulfilled = false

  const result = promise.then(
    value => {
      isFulfilled = true
      isPending = false
      result.status = 'FULFILLED'
      return value
    },
    error => {
      result.status = 'REJECTED'
      isRejected = true
      isPending = false
      throw error
    }
  ) as ObservedPromise<T>
  result.status = 'PENDING'
  result.isFulfilled = (): boolean => isFulfilled
  result.isPending = (): boolean => isPending
  result.isRejected = (): boolean => isRejected
  const wrappedPromise: ObservedPromise<T> = result
  return wrappedPromise
}
