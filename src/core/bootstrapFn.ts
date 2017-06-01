import { CallStackIterator } from "./CallStackIterator"
import { IMetadata } from "../interface/IMetadata"
import { IFakeMethodReplacement } from "../interface/IFakeMethodReplacement"

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
export function bootstrap (target: Object, propertyKey: string, rawMethod: () => any, result?: any): IFakeMethodReplacement {

  // this function replaces main decorated method
  const fakeReplacement = function (...args: any[]): any {

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
    let stack = [].concat(fakeReplacement.$$before, [null], fakeReplacement.$$after)

    // creates an instance which recursively will drive over advices or methods
    // calling this.next (CallStackIterator method)
    /* tslint:disable-next-line */
    new CallStackIterator(metadata, stack, fakeReplacement.$$error)
    return metadata.result
  } as IFakeMethodReplacement

  // initialize stores in returned function
  fakeReplacement.$$before = []
  fakeReplacement.$$after = []
  fakeReplacement.$$error = null
  return fakeReplacement
}
