import { CallStackIterator } from "./CallStackIterator";
export function bootstrap(target, propertyKey, rawMethod, result) {
    var fakeReplacement = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var metadata = {
            scope: this,
            target: target,
            propertyKey: propertyKey,
            rawMethod: rawMethod,
            args: args,
            result: result
        };
        var stack = [].concat(fakeReplacement.$$before, [null], fakeReplacement.$$after);
        new CallStackIterator(metadata, stack);
        return metadata.result;
    };
    fakeReplacement.$$before = [];
    fakeReplacement.$$after = [];
    return fakeReplacement;
}
//# sourceMappingURL=bootstrapFn.js.map