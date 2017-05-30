import { bootstrap } from "./core/bootstrapFn";
export function adviceMetadata(target, propertyKey, parameterIndex) {
    target[propertyKey].$$meta = parameterIndex;
}
export function adviceParam(index) {
    return function (target, propertyKey, parameterIndex) {
        if (!target[propertyKey].$$params) {
            target[propertyKey].$$params = [];
        }
        target[propertyKey].$$params[parameterIndex] = index;
    };
}
export function afterInstance(adviceFn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (target) {
        if (!target || !target.$$raw) {
            var rawConstructor = target;
            target = bootstrap(undefined, "constructor", rawConstructor);
        }
        var advice = adviceFn;
        var stackEntry = { advice: advice, args: args };
        target.$$after.unshift(stackEntry);
        return target;
    };
}
export function afterMethod(adviceFn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        if (!descriptor.value.$$raw) {
            var rawMethod = descriptor.value;
            descriptor.value = bootstrap(target, propertyKey, rawMethod);
        }
        var advice = adviceFn;
        var stackEntry = { advice: advice, args: args };
        descriptor.value.$$after.unshift(stackEntry);
        return descriptor;
    };
}
export function beforeInstance(adviceFn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (target) {
        if (!target || !target.$$raw) {
            var rawConstructor = target;
            target = bootstrap(undefined, "constructor", rawConstructor);
        }
        var advice = adviceFn;
        var stackEntry = { advice: advice, args: args };
        target.$$before.unshift(stackEntry);
        return target;
    };
}
export function beforeMethod(adviceFn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        if (!descriptor.value.$$raw) {
            var rawMethod = descriptor.value;
            descriptor.value = bootstrap(target, propertyKey, rawMethod);
        }
        var advice = adviceFn;
        var stackEntry = { advice: advice, args: args };
        descriptor.value.$$before.unshift(stackEntry);
        return descriptor;
    };
}
//# sourceMappingURL=decorators.js.map