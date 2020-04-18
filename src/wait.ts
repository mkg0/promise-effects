export default function wait<T>(ms: number, valueToResolve?: () => T): Promise<T> {
  return new Promise(resolve =>
    setTimeout(() => resolve(valueToResolve ? valueToResolve() : undefined), ms)
  )
}
