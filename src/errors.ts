export class PromiseEffectsError {
  name = 'PromiseEffectsError'
  constructor(error: { message: string; code: string }) {
    this.message = error.message
    this.code = error.code
  }
  message: string
  code: string
}

export const DELAY_ERROR = new PromiseEffectsError({
  message: 'Delay has to be a number, function or an object',
  code: 'INVALID_DELAY',
})
