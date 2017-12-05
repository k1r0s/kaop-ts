import { CallStackIterator } from "./CallStackIterator"
import { IMetadata } from "../interface/IMetadata"
import { MetadataKey } from "./MetadataKeys"
import store from "./store";

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
export function bootstrap (target: any, propertyKey: string, rawMethod: (...args: any[]) => any, result?: any): Function {
  // this function replaces main decorated method
  const fnref = function (...args: any[]): any {

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
      store.getMetadata(fnref, MetadataKey.BEFORE_ADVICES),
      [null],
      store.getMetadata(fnref, MetadataKey.AFTER_ADVICES)
    )

    // creates an instance which recursively will drive over advices or methods
    // calling this.next (CallStackIterator method)
    /* tslint:disable-next-line */
    new CallStackIterator(metadata, stack, store.getMetadata(fnref, MetadataKey.ERROR_PLACEHOLDER))
    return metadata.result
  }

  // keep original prototype
  fnref.prototype = target.prototype

  return fnref
}

export function buildReflectionProperties (subject: any) {
  store.defineMetadata(subject, MetadataKey.BEFORE_ADVICES, [])
  store.defineMetadata(subject, MetadataKey.AFTER_ADVICES, [])
  store.defineMetadata(subject, MetadataKey.ERROR_PLACEHOLDER, null)
}
