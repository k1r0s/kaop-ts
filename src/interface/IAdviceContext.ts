/**
 * IAdviceContext
 * this interface will provide typings inside an advice while dev
 * coz all advice references will be overrided by 'CallStackIterator'
 */
export interface IAdviceContext {
  stopped: boolean
  next (): void
  stop (): void
}
