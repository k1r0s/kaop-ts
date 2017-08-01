import { CallStackIterator } from "./CallStackIterator"
import { IMetadata } from "../interface/IMetadata"
import { MetadataKey } from "./MetadataKeys"
import "reflect-metadata"

/**
 * @function bootstrap - this function replaces|wraps the given method (that was decorated)
 * with a function which takes all the metadata and instantiate CallStackIterator
 * for the given scope
 *
 * @param  {Object}                 target            represents the class (if method is in static context target will be undefined* in favour of 'scope')
 * @param  {string}                 propertyKey       decorated property name
 * @param  {Function}               rawMethod         decorated method reference
 * @return {IFakeMethodReplacement}                   description
 */
export function bootstrap (target: Object, propertyKey: string, rawMethod: (...args: any[]) => any, result?: any): Function {

  // this function replaces main decorated method
  return function (...args: any[]): any {

    // here we receive almost every needed metadata property
    const metadata = {
      scope: this, // method context which could be the instance or the static context
      target, // class of decorated method
      propertyKey, // property name of decorated method
      rawMethod, // original method
      args, // method arguments
      result // method returned value
    } as IMetadata

    // concat before and after stacks
    let stack = [].concat(
      Reflect.getMetadata(MetadataKey.BEFORE_ADVICES, arguments.callee),
      [null],
      Reflect.getMetadata(MetadataKey.AFTER_ADVICES, arguments.callee)
    )

    // creates an instance which recursively will drive over advices or methods
    // calling this.next (CallStackIterator method)
    /* tslint:disable-next-line */
    new CallStackIterator(metadata, stack, Reflect.getMetadata(MetadataKey.ERROR_PLACEHOLDER, arguments.callee))
    return metadata.result
  }
}

export function buildReflectionProperties (subject: any) {
  Reflect.defineMetadata(MetadataKey.BEFORE_ADVICES, [], subject)
  Reflect.defineMetadata(MetadataKey.AFTER_ADVICES, [], subject)
  Reflect.defineMetadata(MetadataKey.ERROR_PLACEHOLDER, null, subject)
}
