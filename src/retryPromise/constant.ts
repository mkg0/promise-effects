export type DelayFn = (attempt: IAttempt) => number | Promise<void | number>
export type ShouldRetry = (attempt: IAttempt) => boolean
export type OnReconnecting = (attempt: IAttempt) => void

export interface IAttempt {
  attemptNumber: number
  remainingTries: number
  error: Error
}

export interface IAdvanceDelay {
  delay: number
  factor: number
  max?: number
  min?: number
}

export interface IRetryOptions {
  onReconnecting: OnReconnecting
  delay: number | IAdvanceDelay | DelayFn
  shouldRetry: ShouldRetry
  retry: number
  attemptNumber?: number
}

export const defaultDelay: IAdvanceDelay = {
  delay: 1000,
  factor: 1.5,
  max: 60000,
  min: 0,
}
