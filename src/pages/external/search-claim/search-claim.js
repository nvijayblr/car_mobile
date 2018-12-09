var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { CreateClaimPage } from '../../external/create-claim/create-claim';
import * as moment from 'moment';
var SearchClaimPage = /** @class */ (function () {
    function SearchClaimPage(navCtrl, common) {
        this.navCtrl = navCtrl;
        this.common = common;
        this.searchFilters = {
            'CustomerName': '',
            'ClaimInitiationFrom': moment().subtract(2, 'week').toISOString(),
            'ClaimInitiationTo': moment().toISOString(),
            'ClaimTypeId': '4',
            'ComplaintNumber': '',
            'InvoiceNumber': '',
            'StatusID': '0',
            'CategoryID': '0',
            'Initiator': '',
            'NoOfDays': '',
            'GlobalSerach': '',
            'PageSize': 10,
            'PageNum': 1,
            'SortingColumn': 'ClaimId',
            'SortingOrder': 'D'
        };
        this.pagination = {
            maxPages: 5,
            totalItems: 0,
            currentPage: 1,
            itemsPerPage: 10
        };
        this.claimsList = [];
        this.showSearchFilters = true;
        this.claimStatusList = [];
        this.claimCategoryList = [];
        this.claimTypeList = [];
        /*Expand/collapse lists*/
        this.shownGroup = null;
    }
    SearchClaimPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.common.hideLoader();
        this.getAllDropdownData();
        /*Back button action*/
        this.navBar.backButtonClick = function (e) {
            if (_this.showSearchFilters) {
                _this.navCtrl.pop();
            }
            else {
                _this.showSearchFilters = !_this.showSearchFilters;
            }
        };
    };
    SearchClaimPage.prototype.resetClicked = function () {
        this.searchFilters = {
            'CustomerName': '',
            'ClaimInitiationFrom': moment().subtract(2, 'week').toISOString(),
            'ClaimInitiationTo': moment().toISOString(),
            'ClaimTypeId': '0',
            'ComplaintNumber': '',
            'InvoiceNumber': '',
            'StatusID': '0',
            'CategoryID': '0',
            'Initiator': '',
            'NoOfDays': '',
            'GlobalSerach': '',
            'PageSize': 10,
            'PageNum': 1,
            'SortingColumn': 'ClaimId',
            'SortingOrder': 'D'
        };
    };
    SearchClaimPage.prototype.getAllDropdownData = function () {
        var _this = this;
        this.common.http.doGet(this.common.url.getAllDropDownDataURL(), function (response) {
            if (response.ResponseCode === 200) {
                _this.claimStatusList = response.Data.Status;
                _this.claimCategoryList = response.Data.ClaimCategory;
                _this.claimTypeList = response.Data.SectionList;
            }
        }, function (error) {
        });
    };
    SearchClaimPage.prototype.doClaimSearch = function (_searchFilters) {
        var _this = this;
        if (this.initiateDateValidate(_searchFilters.ClaimInitiationFrom, _searchFilters.ClaimInitiationTo)) {
            return;
        }
        this.claimsList = [];
        this.shownGroup = null;
        this.common.showLoader();
        _searchFilters.ClaimInitiationFrom = moment(_searchFilters.ClaimInitiationFrom).format('MM/DD/YYYY');
        _searchFilters.ClaimInitiationTo = moment(_searchFilters.ClaimInitiationTo).format('MM/DD/YYYY');
        this.common.http.doPost(this.common.url.getSearchClaimURL(), _searchFilters, function (response) {
            if (response.Data && response.Data.ResultList) {
                _this.claimsList = response.Data.ResultList;
                _this.pagination.totalItems = response.Data.TotalRows;
                _this.pagination.itemsPerPage = _this.searchFilters.PageSize;
                if (_this.pagination.totalItems > 0) {
                    _this.showSearchFilters = false;
                }
                else {
                    _this.common.showToast('No records found.');
                }
            }
            _this.common.hideLoader();
        }, function (error) {
            _this.common.hideLoader();
            _this.common.showToast(error.ResponseMessage);
        });
    };
    SearchClaimPage.prototype.initiateDateValidate = function (_fromDate, _toDate) {
        if (moment(_toDate).diff(moment(_fromDate)) < 0) {
            this.common.showToast("Initiation To Date must be greater than or equal to Initiation From Date");
            return true;
        }
        return false;
    };
    SearchClaimPage.prototype.applySearch = function (_searchFilters) {
        this.searchFilters.PageNum = 1;
        this.pagination.currentPage = 1;
        this.doClaimSearch(_searchFilters);
    };
    SearchClaimPage.prototype.paginationChanged = function (_event) {
        this.searchFilters.PageNum = _event.page;
        this.searchFilters.PageSize = _event.itemsPerPage;
        this.doClaimSearch(this.searchFilters);
    };
    SearchClaimPage.prototype.gotoClaimPage = function (_complaintNumber) {
        this.navCtrl.push(CreateClaimPage, { complaintNumber: _complaintNumber, isViewMode: true });
    };
    SearchClaimPage.prototype.gotoBackPage = function () {
        if (this.showSearchFilters) {
            this.navCtrl.pop();
        }
        else {
            this.showSearchFilters = true;
        }
    };
    SearchClaimPage.prototype.toggleGroup = function (group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        }
        else {
            this.shownGroup = group;
        }
    };
    ;
    SearchClaimPage.prototype.isGroupShown = function (group) {
        return this.shownGroup === group;
    };
    ;
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], SearchClaimPage.prototype, "navBar", void 0);
    SearchClaimPage = __decorate([
        Component({
            selector: 'page-search-claim',
            templateUrl: 'search-claim.html',
        }),
        __metadata("design:paramtypes", [NavController, CommonProvider])
    ], SearchClaimPage);
    return SearchClaimPage;
}());
export { SearchClaimPage };
//# sourceMappingURL=search-claim.js.map