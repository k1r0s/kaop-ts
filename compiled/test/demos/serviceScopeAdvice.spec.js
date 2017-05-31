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
var HttpService = (function () {
    function HttpService() {
    }
    HttpService.request = function (url, callback) {
        setTimeout(function (_) {
            callback({ result: "Even I preserve advice scope" });
        }, 1500);
    };
    return HttpService;
}());
var MyServiceAdvice = (function (_super) {
    __extends(MyServiceAdvice, _super);
    function MyServiceAdvice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyServiceAdvice.makeHttpRequest = function (url, meta) {
        var _this = this;
        HttpService.request(url, function (message) {
            meta.args.push(message);
            _this.next();
        });
    };
    return MyServiceAdvice;
}(AdvicePool));
__decorate([
    __param(0, adviceParam(0)), __param(1, adviceMetadata),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MyServiceAdvice, "makeHttpRequest", null);
var YetAnotherDummyTest = (function () {
    function YetAnotherDummyTest() {
        this.prop = "asd";
    }
    YetAnotherDummyTest.loadSomething = function (callback, asyncDataFromService) {
        console.log(asyncDataFromService);
        callback();
    };
    return YetAnotherDummyTest;
}());
__decorate([
    beforeMethod(MyServiceAdvice.makeHttpRequest, "/my/path"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], YetAnotherDummyTest, "loadSomething", null);
describe("kaop-ts demo -> scope reference showcase", function () {
    it("advices can hoist references as spected", function (done) {
        YetAnotherDummyTest.loadSomething(done);
    });
});
//# sourceMappingURL=serviceScopeAdvice.spec.js.map