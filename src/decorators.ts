import { IClassAdviceSignature } from "./interface/IClassAdviceSignature"
import { bootstrap , buildReflectionProperties } from "./core/bootstrapFn"
import { IAdviceContext } from "./interface/IAdviceContext"
import { IAdviceSignature } from "./interface/IAdviceSignature"
import { IStackEntry } from "./interface/IStackEntry"
import { IMetadata } from "./interface/IMetadata"
import { MetadataKey } from "./core/MetadataKeys"
import "reflect-metadata"

/**
 * @function adviceMetadata - this decorator function sets a property '$$meta'
 * with the requested metadata param index
 *
 * @param  {any} target          method class
 * @param  {string} propertyKey     ..
 * @param  {number} parameterIndex  ..
 */
export function adviceMetadata (target: any, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(MetadataKey.METADATA_PARAM, parameterIndex, target[propertyKey])
}

/**
 * @function adviceParam - fill an array with the requested param order
 * if array '$$params' property does not exist in the method advice it
 * will be created
 * @param  {number} index requested index param
 */
export function adviceParam (index: number) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const parameters = Reflect.getMetadata(MetadataKey.ADVICE_PARAMS, target[propertyKey]) as any[] || []
    parameters[parameterIndex] = index
    Reflect.defineMetadata(MetadataKey.ADVICE_PARAMS, parameters, target[propertyKey])
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
    let afters = Reflect.getMetadata(MetadataKey.AFTER_ADVICES, target) as IStackEntry[]
    if (!afters) {
      target = bootstrap(target, "constructor", target)
      buildReflectionProperties(target);
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    afters = Reflect.getMetadata(MetadataKey.AFTER_ADVICES, target) as IStackEntry[]
    afters.unshift(stackEntry)
    Reflect.defineMetadata(MetadataKey.AFTER_ADVICES, afters, target)
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
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let afters = Reflect.getMetadata(MetadataKey.AFTER_ADVICES, descriptor.value) as IStackEntry[]
    if (!afters) {
      descriptor.value = bootstrap(target, propertyKey, descriptor.value)
      buildReflectionProperties(descriptor.value)
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    afters = Reflect.getMetadata(MetadataKey.AFTER_ADVICES, descriptor.value) as IStackEntry[]
    afters.unshift(stackEntry)
    Reflect.defineMetadata(MetadataKey.AFTER_ADVICES, afters, descriptor.value)
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
    let befores = Reflect.getMetadata(MetadataKey.BEFORE_ADVICES, target) as IStackEntry[]
    if (!befores) {
      target = bootstrap(target, "constructor", target)
      buildReflectionProperties(target)
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    befores = Reflect.getMetadata(MetadataKey.BEFORE_ADVICES, target) as IStackEntry[]
    befores.unshift(stackEntry)
    Reflect.defineMetadata(MetadataKey.BEFORE_ADVICES, befores, target)
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
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let befores = Reflect.getMetadata(MetadataKey.BEFORE_ADVICES, descriptor.value) as IStackEntry[]
    if (!befores) {
      descriptor.value = bootstrap(target, propertyKey, descriptor.value)
      buildReflectionProperties(descriptor.value)
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    befores = Reflect.getMetadata(MetadataKey.BEFORE_ADVICES, descriptor.value) as IStackEntry[]
    befores.unshift(stackEntry)
    Reflect.defineMetadata(MetadataKey.BEFORE_ADVICES, befores, descriptor.value)
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
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let error = Reflect.getMetadata(MetadataKey.ERROR_PLACEHOLDER, descriptor.value) as IStackEntry
    // If descriptor hasn't been initializated (by default has to be initializated to 'null')
    if (error !== null) {
      // descriptor is initializated, method is wrapped
      descriptor.value = bootstrap(target, propertyKey, descriptor.value)
      buildReflectionProperties(descriptor.value)
    }
    const stackEntry: IStackEntry = { adviceFn, args }
    // Place it on $$error placeholder which will be checked later
    Reflect.defineMetadata(MetadataKey.ERROR_PLACEHOLDER, stackEntry, descriptor.value)
    return descriptor
  }
}
