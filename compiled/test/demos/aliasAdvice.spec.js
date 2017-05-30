var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { AdvicePool, beforeMethod, adviceParam, adviceMetadata } from "../../src/kaop-ts";
var MyAdvicePool = (function (_super) {
    __extends(MyAdvicePool, _super);
    function MyAdvicePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyAdvicePool.testAdvice = function (meta) {
        console.log("im a fucking alias");
        console.log("first argument is: " + meta.args[0]);
    };
    MyAdvicePool.encapsulatedAdvice = function (firstArg, secondArg) {
        console.log("im a fucking alias and I have arguments too >.<!");
        console.log("first advice argument is: " + firstArg);
        console.log("second advice argument is: " + JSON.stringify(secondArg));
    };
    return MyAdvicePool;
}(AdvicePool));
__decorate([
    __param(0, adviceMetadata),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyAdvicePool, "testAdvice", null);
__decorate([
    __param(0, adviceParam(0)), __param(1, adviceParam(1)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MyAdvicePool, "encapsulatedAdvice", null);
var testAdviceAlias = beforeMethod(MyAdvicePool.testAdvice);
var anotherTestAdviceAlias = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    args.unshift(MyAdvicePool.encapsulatedAdvice);
    return beforeMethod.apply(MyAdvicePool, args);
};
var MyBoringDummyTest = (function () {
    function MyBoringDummyTest() {
    }
    MyBoringDummyTest.prototype.something = function (url, callback) {
        callback();
    };
    return MyBoringDummyTest;
}());
__decorate([
    testAdviceAlias,
    anotherTestAdviceAlias("custom", { someProp: 2 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], MyBoringDummyTest.prototype, "something", null);
describe("kaop-ts demo -> alias showcase", function () {
    it("new decorators can be encapsulated with an advice call", function (done) {
        var test = new MyBoringDummyTest();
        test.something("/path/to/anywhere", done);
    });
});
//# sourceMappingURL=aliasAdvice.spec.js.map