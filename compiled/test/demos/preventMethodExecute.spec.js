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
var MyServiceAdvice = (function (_super) {
    __extends(MyServiceAdvice, _super);
    function MyServiceAdvice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyServiceAdvice.checkIfSomeCondition = function (meta) {
        console.log("advice execution");
        if (meta.args[1]) {
            this.stop();
        }
    };
    return MyServiceAdvice;
}(AdvicePool));
__decorate([
    __param(0, adviceMetadata),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyServiceAdvice, "checkIfSomeCondition", null);
var checkIfSomeCondition = beforeMethod(MyServiceAdvice.checkIfSomeCondition);
var NotAnotherTestPlz = (function () {
    function NotAnotherTestPlz() {
        this.prop = "asd";
    }
    NotAnotherTestPlz.loadSomething = function (callback, prevent) {
        console.log("main method execution");
        callback();
    };
    return NotAnotherTestPlz;
}());
__decorate([
    checkIfSomeCondition,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Boolean]),
    __metadata("design:returntype", void 0)
], NotAnotherTestPlz, "loadSomething", null);
describe("kaop-ts demo -> deny method execution showcase", function () {
    it("'this.stop' avoids main method call", function (done) {
        NotAnotherTestPlz.loadSomething(done, true);
        NotAnotherTestPlz.loadSomething(done);
    });
});
//# sourceMappingURL=preventMethodExecute.spec.js.map