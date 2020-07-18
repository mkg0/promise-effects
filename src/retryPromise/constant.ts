export type DelayFn = (attempt: Attempt) => number | Promise<void | number>
export type ShouldRetry = (attempt: Attempt) => boolean | Promise<boolean>
export type OnReconnecting = (attempt: Attempt) => void

export interface Attempt {
  attemptNumber: number
  remainingTries: number
  reason: any
}

export interface AdvanceDelay {
  delay: number
  factor: number
  max?: number
  min?: number
}

export interface RetryOptions {
  onReconnecting: OnReconnecting
  delay: number | AdvanceDelay | DelayFn
  shouldRetry: ShouldRetry
  retry: number
  attemptNumber?: number
}

export const defaultDelay: AdvanceDelay = {
  delay: 1000,
  factor: 1.5,
  max: 60000,
  min: 0,
}
