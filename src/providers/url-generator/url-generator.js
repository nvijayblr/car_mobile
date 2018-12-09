var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant';
var UrlGeneratorProvider = /** @class */ (function () {
    function UrlGeneratorProvider(constant) {
        this.constant = constant;
    }
    UrlGeneratorProvider.prototype.getLanguageList = function () {
        return this.constant.baseURL + 'api/home/Languages';
    };
    UrlGeneratorProvider.prototype.getDomainListUrl = function () {
        return this.constant.baseURL + 'api/GetAllDomains';
    };
    UrlGeneratorProvider.prototype.getLoginUserURL = function () {
        return this.constant.baseURL + 'api/login';
    };
    UrlGeneratorProvider.prototype.getWeightageListURL = function () {
        return this.constant.baseURL + 'api/UserModuleTransactions';
    };
    UrlGeneratorProvider.prototype.getSearchClaimURL = function () {
        return this.constant.baseURL + 'api/searchClaim';
    };
    UrlGeneratorProvider.prototype.getAllDropDownDataURL = function () {
        return this.constant.baseURL + 'api/lookup';
    };
    UrlGeneratorProvider.prototype.getClaimDetailsURL = function (_complaintNo) {
        return this.constant.baseURL + 'api/ClaimDetails?CompliantNumber=' + _complaintNo;
    };
    UrlGeneratorProvider.prototype.getInvoiceSearch = function () {
        return this.constant.baseURL + 'api/invoice/searchInvoice';
    };
    UrlGeneratorProvider.prototype.getDistributionChannelList = function (_SBUId) {
        return this.constant.baseURL + 'api/lookup/DistributionChannel/' + _SBUId;
    };
    UrlGeneratorProvider.prototype.getCreateNewClaimURL = function () {
        return this.constant.baseURL + 'api/SubmitClaim';
    };
    UrlGeneratorProvider.prototype.getDeleteAttachmentURL = function () {
        return this.constant.baseURL + 'api/DeleteFile';
    };
    /*Internal Modules*/
    UrlGeneratorProvider.prototype.getInternalSearchClaimURL = function () {
        return this.constant.baseURL + 'api/internal/searchClaim ';
    };
    UrlGeneratorProvider.prototype.getInternalClaimType = function () {
        return this.constant.baseURL + 'api/internal/GetClaimTypes ';
    };
    UrlGeneratorProvider.prototype.getInternalClaimStatus = function () {
        return this.constant.baseURL + 'api/internal/InternalClaimStatus ';
    };
    UrlGeneratorProvider.prototype.getEmployementType = function () {
        return this.constant.baseURL + 'api/internal/EmployementType ';
    };
    UrlGeneratorProvider.prototype.getInjuryLocation = function () {
        return this.constant.baseURL + 'api/internal/InjuryLocation ';
    };
    UrlGeneratorProvider.prototype.getInjuryNature = function () {
        return this.constant.baseURL + 'api/internal/InjuryNature ';
    };
    UrlGeneratorProvider.prototype.getSendTo = function () {
        return this.constant.baseURL + 'api/internal/SendTo';
    };
    UrlGeneratorProvider.prototype.getAccidentClaim = function (_referenceNo) {
        return this.constant.baseURL + 'api/internal/GetClaim?ReferenceNo=' + _referenceNo;
    };
    UrlGeneratorProvider.prototype.uploadAccidentImages = function (_referenceNo) {
        return this.constant.baseURL + 'api/internal/UploadAccidentFile?ReferenceNo=' + _referenceNo;
    };
    UrlGeneratorProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Constant])
    ], UrlGeneratorProvider);
    return UrlGeneratorProvider;
}());
export { UrlGeneratorProvider };
//# sourceMappingURL=url-generator.js.map