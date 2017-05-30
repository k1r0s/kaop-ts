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
import { AdvicePool, beforeInstance, afterInstance, adviceMetadata } from "../../src/kaop-ts";
var YetAnotherAdvicePool = (function (_super) {
    __extends(YetAnotherAdvicePool, _super);
    function YetAnotherAdvicePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YetAnotherAdvicePool.uselessAdvice = function (metadata) {
        metadata.args.push({ test: 1 });
        console.log(metadata.scope.prop);
    };
    return YetAnotherAdvicePool;
}(AdvicePool));
__decorate([
    __param(0, adviceMetadata),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], YetAnotherAdvicePool, "uselessAdvice", null);
var YetAnotherDummyTest = (function () {
    function YetAnotherDummyTest() {
        this.prop = "asd";
        console.log(arguments);
    }
    return YetAnotherDummyTest;
}());
YetAnotherDummyTest = __decorate([
    beforeInstance(YetAnotherAdvicePool.uselessAdvice),
    afterInstance(YetAnotherAdvicePool.uselessAdvice),
    __metadata("design:paramtypes", [])
], YetAnotherDummyTest);
describe("kaop-ts demo -> instance advices showcase", function () {
    it("advices can be executed within the class constructor as 'instance decorators'", function (done) {
        var test = new YetAnotherDummyTest();
        done();
    });
});
//# sourceMappingURL=instanceAdvice.spec.js.map