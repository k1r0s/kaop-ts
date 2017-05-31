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
import { AdvicePool, beforeMethod, adviceMetadata } from "../../src/kaop-ts";
var MyAdvicePool = (function (_super) {
    __extends(MyAdvicePool, _super);
    function MyAdvicePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyAdvicePool.onException = function (meta) {
        this.stop();
        try {
            meta.result = meta.rawMethod.apply(meta.scope, meta.args);
        }
        catch (err) {
            console.log("There was an error in " + meta.propertyKey + "(): -> " + err.message);
        }
    };
    return MyAdvicePool;
}(AdvicePool));
__decorate([
    __param(0, adviceMetadata),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyAdvicePool, "onException", null);
var ExceptionTest = (function () {
    function ExceptionTest() {
    }
    ExceptionTest.wrongMethod = function (callback) {
        callback();
    };
    return ExceptionTest;
}());
__decorate([
    beforeMethod(MyAdvicePool.onException),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExceptionTest, "wrongMethod", null);
describe("kaop-ts demo -> exception join point", function () {
    it("advices are callback driven, advice stack will be executed when this.next is invoked", function (done) {
        ExceptionTest.wrongMethod(2);
        ExceptionTest.wrongMethod(done);
    });
});
//# sourceMappingURL=onExceptionAdvice.spec.js.map