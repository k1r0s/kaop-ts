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
import { AdvicePool, afterMethod, adviceMetadata } from "../../src/kaop-ts";
var AnotherAdvicePool = (function (_super) {
    __extends(AnotherAdvicePool, _super);
    function AnotherAdvicePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnotherAdvicePool.logMethod = function (metadata) {
        var logger = function (param) { console.log("LOGGER >> ", param); };
        logger(metadata.target.name + "::" + metadata.propertyKey + "() called with arguments: ");
        logger(metadata.args);
        logger("output a result of: ");
        logger(metadata.result);
    };
    return AnotherAdvicePool;
}(AdvicePool));
__decorate([
    __param(0, adviceMetadata),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnotherAdvicePool, "logMethod", null);
var AnotherDummyTest = (function () {
    function AnotherDummyTest() {
    }
    AnotherDummyTest.someMethod = function (param0, param1) {
        return param0 + param1;
    };
    AnotherDummyTest.anotherMethod = function (param0, param1) {
        return param0 + param1;
    };
    return AnotherDummyTest;
}());
__decorate([
    afterMethod(AnotherAdvicePool.logMethod),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Object)
], AnotherDummyTest, "someMethod", null);
__decorate([
    afterMethod(AnotherAdvicePool.logMethod),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Object)
], AnotherDummyTest, "anotherMethod", null);
describe("kaop-ts demo -> afterAdvice showcase", function () {
    it("logMethod should be executed after main method execution and should have access to its scope", function (done) {
        AnotherDummyTest.someMethod("myArgs", 3434);
        AnotherDummyTest.anotherMethod(13123232, 3434);
        done();
    });
});
//# sourceMappingURL=afterAdvice.spec.js.map