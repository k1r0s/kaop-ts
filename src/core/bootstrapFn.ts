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
export function bootstrap(target: Object, propertyKey: string, rawMethod: () => any, result?: any): IFakeMethodReplacement {

    const fakeReplacement = function(...args: any[]): any {

        const metadata = {
            scope: this,
            target,
            propertyKey,
            fakeReplacement,
            args,
            result
        } as IMetadata

        new CallStackIterator(metadata)
        return result
    } as IFakeMethodReplacement

    fakeReplacement.$$raw = rawMethod
    fakeReplacement.$$before = []
    fakeReplacement.$$after = []
    return fakeReplacement
}
