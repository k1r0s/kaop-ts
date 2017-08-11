import { IStackEntry } from "../interface/IStackEntry"
import { IMetadata } from "../interface/IMetadata"
import { MetadataKey } from "./MetadataKeys"
import { getMetadata, defineMetadata } from 'core-js/library/es7/reflect'

/**
 * {class} CallStackIterator
 * this class contains all accessible references within the advice call stack and
 * controls when advices must be invoked, also whether or not main method should
 * be called
 */
export class CallStackIterator {

  private index: number = -1
  private stopped: boolean = false
  private broken: boolean = false

  /**
   * {constructor}
   * receives all the metadata and builds up a shorted array with the current
   * call stack
   * @param {IMetadata} metadata  current metadata for this stack
   */
  constructor (private metadata: IMetadata, private stack: IStackEntry[], private exceptionEntry?: IStackEntry) {
    this.next()
  }

  /**
   * next - this method will resolve by calling the next advice in the call stack
   * or calling the main method
   */
  private next () {

    // increment index used to retrieve following entry
    this.index++

    // asign currentEntry to the following entry
    let currentEntry = this.broken ? null : this.stack[this.index]

    // currentEntry evals to 'null' meaning that the next entry is invoke main method.
    // but it will be skipped if 'this.stopped' evals to 'true' (this.stop was invoked)
    if (currentEntry === null) {
      if (!this.stopped) {
        // we need to know if user want to track exceptions
        if (!this.exceptionEntry) {
          // execute main method as normal
          this.invokeOriginal()
        } else {
          // execute main method with try catch block
          try {
            this.invokeOriginal()
          } catch (err) {
            // if there was an exception we need to store that reference
            this.metadata.exception = err
            // execute advice
            this.executeAdvice(this.exceptionEntry)
          }
        }
      }
      if (!this.broken) {
        this.next()
      }
    }

    // if currentEntry has a value, it must be an entry/advice descriptor
    if (currentEntry) {
      // execute advice
      this.executeAdvice(currentEntry)
    }
  }

  /**
   * stop - this method will alter stopped property of this stack which will
   * prevent main method to be invoked
   */
  private stop () {
    this.stopped = true
  }

  /**
   * this method will prevent all following advices to be called by
   * removing them from call stack queue
   */
  private break () {
    this.broken = true
  }

  /**
   * @private executeAdvice
   * this method executes de current advice on the current context, if the advice is not
   * `asynchronous`, it will call next() on finish.
   * @param currentEntry
   */
  private executeAdvice (currentEntry: IStackEntry) {
    currentEntry.adviceFn.apply(this, this.transformArguments(currentEntry))
    if (!this.isAsync(currentEntry.adviceFn)) {
      this.next()
    }
  }

  /**
   * @private invokeOriginal
   *
   * this method is responsible of invoke the main method with the correct scope
   */
  private invokeOriginal (): void {
    this.metadata.result = this.metadata.rawMethod.apply(this.metadata.scope, this.metadata.args)
  }

  /**
   * @private transformArguments
   *
   * this method organize advice params at requested way
   *
   * @param {IStackEntry} stackEntry contains various references that were modified
   * previously to manage advice params
   *
   * @return {Array} shorted arguments
   */
  private transformArguments (stackEntry: IStackEntry): any[] {

    const transformedArguments = []
    const reflectAdviceParams: number[] = getMetadata(MetadataKey.ADVICE_PARAMS, stackEntry.adviceFn)
    const reflectMetaParam: number = getMetadata(MetadataKey.METADATA_PARAM, stackEntry.adviceFn)

    // if stackEntry.advice.$$params evals is an Array means that the user
    // implemented @adviceParams
    if (reflectAdviceParams instanceof Array) {
      reflectAdviceParams.forEach((requestedArgIndex, index) => {
        transformedArguments[index] = stackEntry.args[requestedArgIndex]
      })
    }

    // if stackEntry.advice.$$meta evals is an Array means that the user
    // implemented @adviceMetadata, so we need to know which index user wants to
    // be placed metadata argument
    if (typeof reflectMetaParam === "number") {
      transformedArguments[reflectMetaParam] = this.metadata
    }

    // if any param decorator was provided by the implementation then metadata and parameters are injected
    if (typeof reflectMetaParam === "undefined" && typeof reflectAdviceParams === "undefined") {
      transformedArguments.push(this.metadata)
      stackEntry.args.forEach((argument) => transformedArguments.push(argument))
    }

    return transformedArguments
  }

  /**
   * @private isAsync
   * this method seeks within function body the expression 'this.next' whichs
   * means that the advice implementation include some async declaration or
   * process
   *
   * @param {Function} rawAdvice method to be checked
   *
   * @return {boolean}
   */
  private isAsync (rawAdvice: Function): boolean {
    return !!rawAdvice
        .toString()
        // Remove quotation marks
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, "")
        // Remove comments
        .replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g, "")
        .match(/[^a-zA-Z$]this\.next[\W]/g)
  }
}
