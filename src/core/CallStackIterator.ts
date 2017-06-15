import { IStackEntry } from "../interface/IStackEntry"
import { IMetadata } from "../interface/IMetadata"

/**
 * {class} CallStackIterator
 * this class contains all accessible references within the advice call stack and
 * controls when advices must be invoked, also whether or not main method should
 * be called
 */
export class CallStackIterator {
  private index: number = -1
  private proceed: boolean = true

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
  next () {

    // increment index used to retrieve following entry
    this.index++

    // asign currentEntry to the following entry
    let currentEntry = this.stack[this.index]

    // currentEntry evals to 'null' meaning that the next entry is invoke main method.
    // but it will be skipped if 'this.proceed' evals to 'false' (this.stop was invoked)
    if (this.proceed && currentEntry === null) {
      // we need to know if user want to track exceptions
      if (!this.exceptionEntry) {
        // execute main method as normal
        this.invokeOriginal()
        this.next()
      } else {
        // execute main method with try catch block
        try {
          this.invokeOriginal()
          // note that this call could be skipped
          this.next()
        } catch (err) {
          // if there was an exception we need to store that reference
          this.metadata.exception = err
          // execute advice
          this.executeAdvice(this.exceptionEntry)
        }
      }
    }

    // if currentEntry has a value, it must be an entry/advice descriptor
    if (currentEntry) {
      // execute advice
      this.executeAdvice(currentEntry)
    }
  }

    /**
     * stop - this method will alter proceed property of this stack which will
     * prevent main method to be invoked
     */
  stop () {
    this.proceed = false
  }

  private executeAdvice (currentEntry: IStackEntry) {
    currentEntry.advice.apply({ next: this.next.bind(this), stop: this.stop.bind(this) }, this.transformArguments(currentEntry))
    if (!this.isAsync(currentEntry.advice)) {
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

    let transformedArguments = []

    // if stackEntry.advice.$$params evals is an Array means that the user
    // implemented @adviceParams
    if (stackEntry.advice.$$params instanceof Array) {
      stackEntry.advice.$$params.forEach((requestedArgIndex, index) => {
        transformedArguments[index] = stackEntry.args[requestedArgIndex]
      })
    }

    // if stackEntry.advice.$$meta evals is an Array means that the user
    // implemented @adviceMetadata, so we need to know which index user wants to
    // be placed metadata argument
    if (typeof stackEntry.advice.$$meta === "number") {
      transformedArguments[stackEntry.advice.$$meta] = this.metadata
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
        // Remove comments, just in case this.next is within a comment
        .replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g, "")
        .match(/[\W]this\.next[\W]/g)
  }
}
