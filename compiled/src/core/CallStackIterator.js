var CallStackIterator = (function () {
    function CallStackIterator(metadata, stack) {
        this.metadata = metadata;
        this.stack = stack;
        this.index = -1;
        this.proceed = true;
        this.next();
    }
    CallStackIterator.prototype.invokeOriginal = function () {
        this.metadata.result = this.metadata.rawMethod.apply(this.metadata.scope, this.metadata.args);
    };
    CallStackIterator.prototype.transformArguments = function (stackEntry) {
        var transformedArguments = [];
        if (stackEntry.advice.$$params instanceof Array) {
            stackEntry.advice.$$params.forEach(function (requestedArgIndex, index) {
                transformedArguments[index] = stackEntry.args[requestedArgIndex];
            });
        }
        if (typeof stackEntry.advice.$$meta === "number") {
            transformedArguments[stackEntry.advice.$$meta] = this.metadata;
        }
        return transformedArguments;
    };
    CallStackIterator.prototype.next = function () {
        this.index++;
        var currentEntry = this.stack[this.index];
        if (currentEntry === undefined) {
            return;
        }
        if (this.proceed && currentEntry === null) {
            this.invokeOriginal();
            this.next();
            return;
        }
        if (currentEntry) {
            currentEntry.advice.apply({ next: this.next.bind(this), stop: this.stop.bind(this) }, this.transformArguments(currentEntry));
            if (!this.isAsync(currentEntry.advice)) {
                this.next();
            }
            return;
        }
    };
    CallStackIterator.prototype.stop = function () {
        this.proceed = false;
    };
    CallStackIterator.prototype.isAsync = function (rawAdvice) {
        return !!rawAdvice
            .toString()
            .match(/[^a-zA-Z$]this\.next[^a-zA-Z_$0-9]/g);
    };
    return CallStackIterator;
}());
export { CallStackIterator };
//# sourceMappingURL=CallStackIterator.js.map