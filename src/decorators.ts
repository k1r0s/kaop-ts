import { IClassAdviceSignature } from "./interface/IClassAdviceSignature"
import { bootstrap } from "./core/bootstrapFn"
import { IAdviceSignature } from "./interface/IAdviceSignature"
import { IAdviceParamInjector } from "./interface/IAdviceParamInjector"
import { IStackEntry } from "./interface/IStackEntry"

/**
 * @function adviceMetadata - this decorator function sets a property '$$meta'
 * with the requested metadata param index
 *
 * @param  {Object} target          method class
 * @param  {string} propertyKey     ..
 * @param  {number} parameterIndex  ..
 */
export function adviceMetadata (target: Object, propertyKey: string | symbol, parameterIndex: number) {
  target[propertyKey].$$meta = parameterIndex
}

/**
 * @function adviceParam - fill an array with the requested param order
 * if array '$$params' property does not exist in the method advice it
 * will be created
 * @param  {number} index requested index param
 */
export function adviceParam (index: number) {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    if (!target[propertyKey].$$params) { target[propertyKey].$$params = [] }
    target[propertyKey].$$params[parameterIndex] = index
  }
}

/**
 * @function afterInstance - this decorator function places the 'adviceFn' to be executed
 * within (after) the decorated class (constructor) call stack
 *
 * @param  {Function} adviceFn              advice reference
 * @param  {Array}    args                  advice arguments
 * @return {IClassAdviceSignature}          wrapped constructor reference
 */
export function afterInstance (adviceFn: (...args) => void, ...args: any[]): IClassAdviceSignature {
  return function (target: any) {
    if (!target || !target.$$raw) {
      let rawConstructor = target
      target = bootstrap(undefined, "constructor", rawConstructor)
    }
    const advice = adviceFn as IAdviceParamInjector
    const stackEntry: IStackEntry = { advice, args }
    target.$$after.unshift(stackEntry)
    return target
  }
}

/**
 * @function afterMethod - this decorator function places the 'adviceFn' to be executed
 * within (after) the decorated method call stack
 *
 * @param  {Function} adviceFn              advice reference
 * @param  {Array}    args                  advice arguments
 * @return {IAdviceSignature}               wrapped method reference
 */
export function afterMethod (adviceFn: (...args) => void, ...args: any[]): IAdviceSignature {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!descriptor.value.$$raw) {
      let rawMethod = descriptor.value
      descriptor.value = bootstrap(target, propertyKey, rawMethod)
    }
    const advice = adviceFn as IAdviceParamInjector
    const stackEntry: IStackEntry = { advice, args }
    descriptor.value.$$after.unshift(stackEntry)
    return descriptor
  }
}

/**
 * @function beforeInstance - this decorator function places the 'adviceFn' to be executed
 * within (before) the decorated class (constructor) call stack
 *
 * @param  {Function} adviceFn              advice reference
 * @param  {Array}    args                  advice arguments
 * @return {IClassAdviceSignature}          wrapped constructor reference
 */
export function beforeInstance (adviceFn: (...args) => void, ...args: any[]): IClassAdviceSignature {
  return function (target: any) {
    if (!target || !target.$$raw) {
      let rawConstructor = target
      target = bootstrap(undefined, "constructor", rawConstructor)
    }
    const advice = adviceFn as IAdviceParamInjector
    const stackEntry: IStackEntry = { advice, args }
    target.$$before.unshift(stackEntry)
    return target
  }
}

/**
 * @function beforeMethod - this decorator function places the 'adviceFn' to be executed
 * within (before) the decorated method call stack
 *
 * @param  {Function} adviceFn              advice reference
 * @param  {Array}    args                  advice arguments
 * @return {IAdviceSignature}               wrapped method reference
 */
export function beforeMethod (adviceFn: (...args) => void, ...args: any[]): IAdviceSignature {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!descriptor.value.$$raw) {
      let rawMethod = descriptor.value
      descriptor.value = bootstrap(target, propertyKey, rawMethod)
    }
    const advice = adviceFn as IAdviceParamInjector
    const stackEntry: IStackEntry = { advice, args }
    descriptor.value.$$before.unshift(stackEntry)
    return descriptor
  }
}
