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
            fakeReplacement: fakeReplacement,
            args: args,
            result: result
        };
        new CallStackIterator(metadata);
        return metadata.result;
    };
    fakeReplacement.$$raw = rawMethod;
    fakeReplacement.$$before = [];
    fakeReplacement.$$after = [];
    return fakeReplacement;
}
//# sourceMappingURL=bootstrapFn.js.map