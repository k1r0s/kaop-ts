import { IClassAdviceSignature } from "./interface/IClassAdviceSignature"
import { bootstrap , buildReflectionProperties } from "./core/bootstrapFn"
import { IAdviceContext } from "./interface/IAdviceContext"
import { IAdviceSignature } from "./interface/IAdviceSignature"
import { IStackEntry } from "./interface/IStackEntry"
import { IMetadata } from "./interface/IMetadata"
import { MetadataKey } from "./core/MetadataKeys"
import store from "./core/store";


/**
 * @function adviceMetadata - this decorator function sets a property '$$meta'
 * with the requested metadata param index
 *
 * @param  {any} target          method class
 * @param  {string} propertyKey     ..
 * @param  {number} parameterIndex  ..
 */
export function adviceMetadata (target: any, propertyKey: string | symbol, parameterIndex: number) {
  store.defineMetadata(target[propertyKey], MetadataKey.METADATA_PARAM, parameterIndex)
}

/**
 * @function adviceParam - fill an array with the requested param order
 * if array '$$params' property does not exist in the method advice it
 * will be created
 * @param  {number} index requested index param
 */
export function adviceParam (index: number) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const parameters = store.getMetadata(target[propertyKey], MetadataKey.ADVICE_PARAMS) as any[] || []
    parameters[parameterIndex] = index
    store.defineMetadata(target[propertyKey], MetadataKey.ADVICE_PARAMS, parameters)
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
 export function afterInstance<B = any> (adviceFn: (this: IAdviceContext, meta: IMetadata<B>, ...args) => void, ...args: any[]): IClassAdviceSignature<B> {
  return function (target: any) {
    let afters = store.getMetadata(target, MetadataKey.AFTER_ADVICES) as IStackEntry[]
    if (!afters) {
      target = bootstrap(target, "constructor", target)
      buildReflectionProperties(target);
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    afters = store.getMetadata(target, MetadataKey.AFTER_ADVICES) as IStackEntry[]
    afters.unshift(stackEntry)
    store.defineMetadata(target, MetadataKey.AFTER_ADVICES, afters)
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
export function afterMethod<B = any, K extends keyof B = any> (adviceFn: (this: IAdviceContext, meta: IMetadata<B>, ...args) => void, ...args: any[]): IAdviceSignature<B, K> {
  return function (target: any, propertyKey: string, descriptor) {
    let afters = store.getMetadata(descriptor.value, MetadataKey.AFTER_ADVICES) as IStackEntry[]
    if (!afters) {
      descriptor.value = bootstrap(target, propertyKey, descriptor.value)
      buildReflectionProperties(descriptor.value)
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    afters = store.getMetadata(descriptor.value, MetadataKey.AFTER_ADVICES) as IStackEntry[]
    afters.unshift(stackEntry)
    store.defineMetadata(descriptor.value, MetadataKey.AFTER_ADVICES, afters)
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
export function beforeInstance<B = any> (adviceFn: (this: IAdviceContext, meta: IMetadata<B>, ...args) => void, ...args: any[]): IClassAdviceSignature<B> {
  return function (target: any) {
    let befores = store.getMetadata(target, MetadataKey.BEFORE_ADVICES) as IStackEntry[]
    if (!befores) {
      target = bootstrap(target, "constructor", target)
      buildReflectionProperties(target)
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    befores = store.getMetadata(target, MetadataKey.BEFORE_ADVICES) as IStackEntry[]
    befores.unshift(stackEntry)
    store.defineMetadata(target, MetadataKey.BEFORE_ADVICES, befores)
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
export function beforeMethod<B = any, K extends keyof B = any> (adviceFn: (this: IAdviceContext, meta: IMetadata<B>, ...args) => void, ...args: any[]): IAdviceSignature<B, K> {
  return function (target: any, propertyKey: string, descriptor) {
    let befores = store.getMetadata(descriptor.value, MetadataKey.BEFORE_ADVICES) as IStackEntry[]
    if (!befores) {
      descriptor.value = bootstrap(target, propertyKey, descriptor.value)
      buildReflectionProperties(descriptor.value)
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    befores = store.getMetadata(descriptor.value, MetadataKey.BEFORE_ADVICES) as IStackEntry[]
    befores.unshift(stackEntry)
    store.defineMetadata(descriptor.value, MetadataKey.BEFORE_ADVICES, befores)
    return descriptor
  }
}


/**
 * @function onException - this decorator function places the `adviceFn` as a
 * handler for any exception triggered by decorated method
 *
 * @param  {Function}         adviceFn advice function
 * @param  {Array}            args advice arguments
 * @return {IAdviceSignature} wrapped method reference
 */
export function onException<B = any, K extends keyof B = any> (adviceFn: (this: IAdviceContext, meta: IMetadata<B>, ...args) => void, ...args: any[]): IAdviceSignature<B, K> {
  return function (target: any, propertyKey: string, descriptor) {
    let error = store.getMetadata(MetadataKey.ERROR_PLACEHOLDER, descriptor.value) as IStackEntry
    // If descriptor hasn't been initializated (by default has to be initializated to 'null')
    if (error !== null) {
      // descriptor is initializated, method is wrapped
      descriptor.value = bootstrap(target, propertyKey, descriptor.value)
      buildReflectionProperties(descriptor.value)
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    // Place it on $$error placeholder which will be checked later
    store.defineMetadata(descriptor.value, MetadataKey.ERROR_PLACEHOLDER, stackEntry)
    return descriptor
  }
}
