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
import { AdvicePool, beforeMethod, adviceMetadata, adviceParam } from "../../src/kaop-ts";
var MyAdvicePool = (function (_super) {
    __extends(MyAdvicePool, _super);
    function MyAdvicePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyAdvicePool.testAdvice = function (greet) {
        console.log(greet);
    };
    MyAdvicePool.asyncAdvice = function (metadata, milisecs) {
        var _this = this;
        console.log("MyAdvicePool.asyncAdvice execution");
        console.log("reading a property of the current instance: " + metadata.scope.someProp);
        setTimeout(function (_) {
            console.log("after waiting " + milisecs + " ms");
            metadata.args.push({ some: "async" });
            _this.next();
        }, milisecs);
    };
    return MyAdvicePool;
}(AdvicePool));
__decorate([
    __param(0, adviceParam(0)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyAdvicePool, "testAdvice", null);
__decorate([
    __param(0, adviceMetadata), __param(1, adviceParam(0)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MyAdvicePool, "asyncAdvice", null);
var MyDummyTest = (function () {
    function MyDummyTest() {
        this.someProp = ":o!";
    }
    MyDummyTest.prototype.something = function (url, callback, asyncData) {
        console.log("method execution");
        console.log("url param " + url);
        console.log("asyncData optional param " + asyncData.some);
        callback();
    };
    return MyDummyTest;
}());
__decorate([
    beforeMethod(MyAdvicePool.testAdvice, "hi, how are you!"),
    beforeMethod(MyAdvicePool.asyncAdvice, 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function, Object]),
    __metadata("design:returntype", void 0)
], MyDummyTest.prototype, "something", null);
describe("kaop-ts demo -> async decorators showcase", function () {
    it("advices are callback driven, advice stack will be executed when this.next is invoked", function (done) {
        var test = new MyDummyTest();
        test.something("/path/to/anywhere", done);
    });
});
//# sourceMappingURL=beforeAsync.spec.js.map