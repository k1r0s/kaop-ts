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
    constructor(private metadata: IMetadata, private stack: IStackEntry[]) {
        this.next()
    }


    /**
     * @private invokeOriginal
     *
     * this method is responsible of invoke the main method with the correct scope
     */
    private invokeOriginal(): void {
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
    private transformArguments(stackEntry: IStackEntry): any[] {

        let transformedArguments = []

        if(stackEntry.advice.$$params instanceof Array) {
            stackEntry.advice.$$params.forEach((requestedArgIndex, index) => {
                transformedArguments[index] = stackEntry.args[requestedArgIndex]
            })
        }

        if(typeof stackEntry.advice.$$meta === "number") {
            transformedArguments[stackEntry.advice.$$meta] = this.metadata
        }

        return transformedArguments
    }


    /**
     * next - this method will resolve by calling the next advice in the call stack
     * or calling the main method
     */
    next() {
        this.index++

        let currentEntry = this.stack[this.index]

        if(currentEntry === undefined) {
            return
        }

        if(this.proceed && currentEntry === null) {
            this.invokeOriginal()
            this.next()
            return
        }

        if(currentEntry) {
            currentEntry.advice.apply({ next: this.next.bind(this), stop: this.stop.bind(this) }, this.transformArguments(currentEntry))
            if(!this.isAsync(currentEntry.advice)) {
                this.next()
            }
            return
        }
    }

    /**
     * stop - this method will alter proceed property of this stack which will
     * prevent main method to be invoked
     */
    stop() {
        this.proceed = false
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
    private isAsync(rawAdvice: Function): boolean {
        return !!rawAdvice
        .toString()
        .match(/[^a-zA-Z$]this\.next[^a-zA-Z_$0-9]/g)
    }
}
